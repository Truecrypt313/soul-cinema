'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Search, Download, Mail, ExternalLink, Trash2 } from 'lucide-react'

type Lead = {
  id: string; name: string; company: string | null; email: string; phone: string | null
  product_url: string | null; product_type: string | null; project_goal: string | null
  budget: string | null; message: string; status: string; internal_notes: string | null; created_at: string
}

const STATUS: Record<string, string> = { new: 'Neu', contacted: 'Kontaktiert', in_talks: 'In Gespräch', won: 'Gewonnen', lost: 'Verloren' }

export default function AdminLeads() {
  const { toast } = useToast()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [active, setActive] = useState<Lead | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('contact_leads').select('*').order('created_at', { ascending: false })
    if (error) toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    setLeads((data as Lead[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const update = async (id: string, patch: Partial<Lead>) => {
    const { error } = await supabase.from('contact_leads').update(patch).eq('id', id)
    if (error) return toast({ title: 'Update fehlgeschlagen', description: error.message, variant: 'destructive' })
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...patch } : l)))
    if (active?.id === id) setActive(prev => prev ? { ...prev, ...patch } : prev)
    toast({ title: 'Gespeichert' })
  }
  const remove = async (id: string) => {
    if (!confirm('Anfrage löschen?')) return
    await supabase.from('contact_leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
    setActive(null)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads
      .filter(l => filter === 'all' || l.status === filter)
      .filter(l => !q || [l.name, l.email, l.company || ''].some(s => s.toLowerCase().includes(q)))
  }, [leads, filter, search])

  const exportCsv = () => {
    const cols = ['created_at','name','company','email','phone','product_type','project_goal','budget','product_url','status','message','internal_notes']
    const esc = (s: any) => `"${String(s ?? '').replace(/"/g, '""')}"`
    const csv = [cols.join(','), ...filtered.map(l => cols.map(c => esc((l as any)[c])).join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0,10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black">Anfragen</h1>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-foreground/5">
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>Alle ({leads.length})</FilterBtn>
        {Object.entries(STATUS).map(([k, v]) => (
          <FilterBtn key={k} active={filter === k} onClick={() => setFilter(k)}>{v} ({leads.filter(l => l.status === k).length})</FilterBtn>
        ))}
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suche: Name, E-Mail, Unternehmen…"
          className="w-full pl-9 pr-3 py-2 rounded-md bg-background border border-border" />
      </div>

      {loading ? <div className="text-muted-foreground">Lade…</div> : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-3">
            {filtered.map(l => (
              <button key={l.id} onClick={() => setActive(l)}
                className={`w-full text-left bg-card clean-border rounded-xl p-4 hover:border-[#C9963B]/40 transition ${active?.id === l.id ? 'border-[#C9963B]/60' : ''}`}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="min-w-0">
                    <div className="font-bold truncate">{l.name} {l.company && <span className="text-muted-foreground font-normal">· {l.company}</span>}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.email} {l.phone && `· ${l.phone}`}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-foreground/10 font-medium whitespace-nowrap">{STATUS[l.status] ?? l.status}</span>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">{l.message}</div>
                <div className="text-xs text-muted-foreground mt-2">{new Date(l.created_at).toLocaleString('de-DE')}</div>
              </button>
            ))}
            {filtered.length === 0 && <div className="text-muted-foreground text-sm">Keine Anfragen.</div>}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            {active ? (
              <div className="bg-card clean-border rounded-xl p-6 space-y-4">
                <div>
                  <div className="text-lg font-black">{active.name}</div>
                  <a href={`mailto:${active.email}`} className="text-sm underline inline-flex items-center gap-1"><Mail className="w-3 h-3" />{active.email}</a>
                </div>
                <Detail label="Unternehmen" value={active.company} />
                <Detail label="Telefon" value={active.phone} />
                <Detail label="Produktlink" value={active.product_url} link />
                <Detail label="Produkttyp" value={active.product_type} />
                <Detail label="Ziel" value={active.project_goal} />
                <Detail label="Budget" value={active.budget} />
                <div>
                  <div className="text-xs uppercase text-muted-foreground mb-1">Nachricht</div>
                  <div className="text-sm whitespace-pre-wrap">{active.message}</div>
                </div>
                <div>
                  <label className="text-xs uppercase text-muted-foreground block mb-1">Status</label>
                  <select value={active.status} onChange={e => update(active.id, { status: e.target.value })} className="w-full px-3 py-2 rounded-md bg-background border border-border">
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase text-muted-foreground block mb-1">Interne Notizen</label>
                  <textarea rows={4} defaultValue={active.internal_notes ?? ''}
                    onBlur={e => { if (e.target.value !== (active.internal_notes ?? '')) update(active.id, { internal_notes: e.target.value }) }}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border" />
                </div>
                <button onClick={() => remove(active.id)} className="text-sm text-red-500 hover:underline inline-flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Anfrage löschen
                </button>
              </div>
            ) : <div className="text-muted-foreground text-sm">Anfrage zum Bearbeiten auswählen.</div>}
          </aside>
        </div>
      )}
    </div>
  )
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`px-3 py-1.5 rounded-md text-sm font-medium ${active ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>{children}</button>
}
function Detail({ label, value, link }: { label: string; value: string | null; link?: boolean }) {
  if (!value) return null
  return <div>
    <div className="text-xs uppercase text-muted-foreground">{label}</div>
    {link ? <a href={value} target="_blank" rel="noopener" className="text-sm underline break-all inline-flex items-center gap-1">{value}<ExternalLink className="w-3 h-3" /></a>
          : <div className="text-sm">{value}</div>}
  </div>
}
