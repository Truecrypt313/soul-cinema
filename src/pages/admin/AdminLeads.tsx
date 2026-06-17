'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

type Lead = {
  id: string
  name: string
  company: string | null
  email: string
  phone: string | null
  product_url: string | null
  product_type: string | null
  project_goal: string | null
  budget: string | null
  message: string
  status: string
  internal_notes: string | null
  created_at: string
}

const STATUS: Record<string, string> = {
  new: 'Neu',
  contacted: 'Kontaktiert',
  in_talks: 'In Gespräch',
  won: 'Gewonnen',
  lost: 'Verloren',
}

export default function AdminLeads() {
  const { toast } = useToast()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [active, setActive] = useState<Lead | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contact_leads')
      .select('*')
      .order('created_at', { ascending: false })
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
    if (!confirm('Diese Anfrage wirklich löschen?')) return
    const { error } = await supabase.from('contact_leads').delete().eq('id', id)
    if (error) return toast({ title: 'Löschen fehlgeschlagen', description: error.message, variant: 'destructive' })
    setLeads(prev => prev.filter(l => l.id !== id))
    setActive(null)
    toast({ title: 'Gelöscht' })
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">Anfragen</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>Alle ({leads.length})</FilterBtn>
        {Object.entries(STATUS).map(([k, v]) => (
          <FilterBtn key={k} active={filter === k} onClick={() => setFilter(k)}>
            {v} ({leads.filter(l => l.status === k).length})
          </FilterBtn>
        ))}
      </div>

      {loading ? (
        <div className="text-muted-foreground">Lade…</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground">Keine Anfragen.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {filtered.map(l => (
              <button
                key={l.id}
                onClick={() => setActive(l)}
                className={`w-full text-left bg-card clean-border rounded-xl p-5 hover:elevated-shadow gentle-animation ${active?.id === l.id ? 'ring-2 ring-foreground' : ''}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="font-bold">{l.name} {l.company && <span className="text-muted-foreground font-normal">· {l.company}</span>}</div>
                    <div className="text-sm text-muted-foreground">{l.email}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-foreground/10 font-medium">{STATUS[l.status] ?? l.status}</span>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">{l.message}</div>
                <div className="text-xs text-muted-foreground mt-2">{new Date(l.created_at).toLocaleString('de-DE')}</div>
              </button>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            {active ? (
              <div className="bg-card clean-border rounded-xl p-6 space-y-4">
                <div>
                  <div className="text-lg font-black">{active.name}</div>
                  <a href={`mailto:${active.email}`} className="text-sm underline">{active.email}</a>
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
                  <select
                    value={active.status}
                    onChange={e => update(active.id, { status: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border"
                  >
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase text-muted-foreground block mb-1">Interne Notizen</label>
                  <textarea
                    rows={4}
                    defaultValue={active.internal_notes ?? ''}
                    onBlur={e => {
                      const val = e.target.value
                      if (val !== (active.internal_notes ?? '')) update(active.id, { internal_notes: val })
                    }}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border"
                  />
                </div>

                <button onClick={() => remove(active.id)} className="text-sm text-red-500 hover:underline">
                  Anfrage löschen
                </button>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">Anfrage zum Bearbeiten auswählen.</div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium ${active ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
    >
      {children}
    </button>
  )
}

function Detail({ label, value, link }: { label: string; value: string | null; link?: boolean }) {
  if (!value) return null
  return (
    <div>
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      {link ? (
        <a href={value} target="_blank" rel="noopener" className="text-sm underline break-all">{value}</a>
      ) : (
        <div className="text-sm">{value}</div>
      )}
    </div>
  )
}
