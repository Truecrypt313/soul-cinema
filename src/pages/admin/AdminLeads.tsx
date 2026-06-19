'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Search, Download, Mail, ExternalLink, Trash2, Flag, CalendarClock } from 'lucide-react'

type Lead = {
  id: string; name: string; company: string | null; email: string; phone: string | null
  product_url: string | null; product_type: string | null; project_goal: string | null
  budget: string | null; message: string; status: string; internal_notes: string | null; created_at: string
  referrer_domain: string | null; utm_source: string | null; utm_medium: string | null
  utm_campaign: string | null; utm_content: string | null; utm_term: string | null
  landing_page: string | null; conversion_page: string | null; device_type: string | null
  interest_package: string | null; follow_up_at: string | null; lead_priority: string | null
}

type StatusHistory = { id: string; old_status: string | null; new_status: string; changed_at: string; changed_by: string | null }

const STATUS: Record<string, string> = { new: 'Neu', contacted: 'Kontaktiert', in_talks: 'In Gespräch', won: 'Gewonnen', lost: 'Verloren' }
const PRIORITY: Record<string, string> = { low: 'Niedrig', normal: 'Normal', high: 'Hoch' }
const PRIORITY_COLOR: Record<string, string> = {
  low: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  normal: 'bg-foreground/10 text-foreground/70 border-border',
  high: 'bg-red-500/15 text-red-400 border-red-500/30',
}

type SortKey = 'newest' | 'follow_up' | 'status' | 'priority'

export default function AdminLeads() {
  const { toast } = useToast()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [active, setActive] = useState<Lead | null>(null)
  const [history, setHistory] = useState<StatusHistory[]>([])
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [campaignFilter, setCampaignFilter] = useState<string>('all')
  const [packageFilter, setPackageFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [followUpOnly, setFollowUpOnly] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('newest')

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('contact_leads' as any).select('*').order('created_at', { ascending: false })
    if (error) toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    setLeads(((data as unknown) as Lead[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!active) { setHistory([]); return }
    ;(async () => {
      const { data } = await supabase.from('lead_status_history' as any).select('*').eq('lead_id', active.id).order('changed_at', { ascending: false })
      setHistory(((data as unknown) as StatusHistory[]) ?? [])
    })()
  }, [active?.id])

  const update = async (id: string, patch: Partial<Lead>) => {
    const { error } = await supabase.from('contact_leads' as any).update(patch as any).eq('id', id)
    if (error) return toast({ title: 'Update fehlgeschlagen', description: error.message, variant: 'destructive' })
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...patch } : l)))
    if (active?.id === id) {
      setActive(prev => prev ? { ...prev, ...patch } : prev)
      // refresh history if status changed
      if ('status' in patch) {
        const { data } = await supabase.from('lead_status_history' as any).select('*').eq('lead_id', id).order('changed_at', { ascending: false })
        setHistory(((data as unknown) as StatusHistory[]) ?? [])
      }
    }
    toast({ title: 'Gespeichert' })
  }
  const remove = async (id: string) => {
    if (!confirm('Anfrage löschen?')) return
    await supabase.from('contact_leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
    setActive(null)
  }

  const sources = useMemo(() => Array.from(new Set(leads.map(l => l.utm_source).filter(Boolean))) as string[], [leads])
  const campaigns = useMemo(() => Array.from(new Set(leads.map(l => l.utm_campaign).filter(Boolean))) as string[], [leads])
  const packages = useMemo(() => Array.from(new Set(leads.map(l => l.interest_package).filter(Boolean))) as string[], [leads])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const now = Date.now()
    let list = leads
      .filter(l => filter === 'all' || l.status === filter)
      .filter(l => sourceFilter === 'all' || l.utm_source === sourceFilter)
      .filter(l => campaignFilter === 'all' || l.utm_campaign === campaignFilter)
      .filter(l => packageFilter === 'all' || l.interest_package === packageFilter)
      .filter(l => priorityFilter === 'all' || (l.lead_priority ?? 'normal') === priorityFilter)
      .filter(l => !followUpOnly || (l.follow_up_at && new Date(l.follow_up_at).getTime() <= now))
      .filter(l => !q || [l.name, l.email, l.company || '', l.message || '', l.utm_campaign || '', l.interest_package || ''].some(s => s.toLowerCase().includes(q)))

    if (sortKey === 'follow_up') {
      list = [...list].sort((a, b) => {
        const av = a.follow_up_at ? new Date(a.follow_up_at).getTime() : Infinity
        const bv = b.follow_up_at ? new Date(b.follow_up_at).getTime() : Infinity
        return av - bv
      })
    } else if (sortKey === 'status') {
      list = [...list].sort((a, b) => (a.status || '').localeCompare(b.status || ''))
    } else if (sortKey === 'priority') {
      const order: Record<string, number> = { high: 0, normal: 1, low: 2 }
      list = [...list].sort((a, b) => (order[a.lead_priority ?? 'normal'] ?? 1) - (order[b.lead_priority ?? 'normal'] ?? 1))
    }
    return list
  }, [leads, filter, search, sourceFilter, campaignFilter, packageFilter, priorityFilter, followUpOnly, sortKey])

  const exportCsv = () => {
    const cols = [
      'created_at','name','company','email','phone','product_type','project_goal','budget',
      'product_url','status','lead_priority','follow_up_at','interest_package',
      'utm_source','utm_medium','utm_campaign','utm_content','utm_term',
      'referrer_domain','landing_page','conversion_page','device_type',
      'message','internal_notes'
    ]
    const headers: Record<string, string> = {
      created_at: 'Erstellt', name: 'Name', company: 'Unternehmen', email: 'E-Mail', phone: 'Telefon',
      product_type: 'Produkttyp', project_goal: 'Ziel', budget: 'Budget', product_url: 'Produktlink',
      status: 'Status', lead_priority: 'Priorität', follow_up_at: 'Follow-up', interest_package: 'Paketinteresse',
      utm_source: 'UTM Source', utm_medium: 'UTM Medium', utm_campaign: 'UTM Campaign',
      utm_content: 'UTM Content', utm_term: 'UTM Term', referrer_domain: 'Referrer',
      landing_page: 'Landing Page', conversion_page: 'Conversion Page', device_type: 'Gerät',
      message: 'Nachricht', internal_notes: 'Interne Notizen',
    }
    const esc = (s: any) => `"${String(s ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
    const csv = [
      cols.map(c => esc(headers[c])).join(','),
      ...filtered.map(l => cols.map(c => esc((l as any)[c])).join(',')),
    ].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0,10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const isFollowUpDue = (l: Lead) => l.follow_up_at && new Date(l.follow_up_at).getTime() <= Date.now()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black">Anfragen</h1>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-foreground/5">
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>Alle ({leads.length})</FilterBtn>
        {Object.entries(STATUS).map(([k, v]) => (
          <FilterBtn key={k} active={filter === k} onClick={() => setFilter(k)}>{v} ({leads.filter(l => l.status === k).length})</FilterBtn>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <Select label="Quelle" value={sourceFilter} onChange={setSourceFilter} options={[['all', 'Alle Quellen'], ...sources.map(s => [s, s] as [string, string])]} />
        <Select label="Kampagne" value={campaignFilter} onChange={setCampaignFilter} options={[['all', 'Alle Kampagnen'], ...campaigns.map(s => [s, s] as [string, string])]} />
        <Select label="Paket" value={packageFilter} onChange={setPackageFilter} options={[['all', 'Alle Pakete'], ...packages.map(s => [s, s] as [string, string])]} />
        <Select label="Priorität" value={priorityFilter} onChange={setPriorityFilter} options={[['all', 'Alle'], ['high', 'Hoch'], ['normal', 'Normal'], ['low', 'Niedrig']]} />
        <label className="text-xs flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2">
          <input type="checkbox" checked={followUpOnly} onChange={e => setFollowUpOnly(e.target.checked)} className="accent-[#C9963B]" />
          Follow-up fällig
        </label>
        <Select label="Sortieren" value={sortKey} onChange={(v) => setSortKey(v as SortKey)} options={[['newest', 'Neueste'], ['follow_up', 'Follow-up'], ['status', 'Status'], ['priority', 'Priorität']]} />
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suche: Name, E-Mail, Unternehmen, Nachricht, Kampagne…"
          className="w-full pl-9 pr-3 py-2 rounded-md bg-background border border-border" />
      </div>

      {loading ? <div className="text-muted-foreground">Lade…</div> : (
        <div className="grid lg:grid-cols-[1fr_440px] gap-6">
          <div className="space-y-3">
            {filtered.map(l => {
              const due = isFollowUpDue(l)
              const prio = l.lead_priority ?? 'normal'
              return (
                <div key={l.id}
                  className={`bg-card clean-border rounded-xl p-4 hover:border-[#C9963B]/40 transition ${active?.id === l.id ? 'border-[#C9963B]/60' : ''}`}>
                  <button onClick={() => setActive(l)} className="w-full text-left">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="min-w-0">
                        <div className="font-bold truncate">{l.name} {l.company && <span className="text-muted-foreground font-normal">· {l.company}</span>}</div>
                        <div className="text-xs text-muted-foreground truncate">{l.email} {l.phone && `· ${l.phone}`}</div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {prio !== 'normal' && <span className={`text-[10px] px-2 py-0.5 rounded border ${PRIORITY_COLOR[prio]}`}>{PRIORITY[prio]}</span>}
                        <span className="text-xs px-2 py-1 rounded bg-foreground/10 font-medium whitespace-nowrap">{STATUS[l.status] ?? l.status}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{l.message}</div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground mt-2">
                      <span>{new Date(l.created_at).toLocaleString('de-DE')}</span>
                      {l.utm_source && <Badge>Quelle: {l.utm_source}</Badge>}
                      {l.utm_campaign && <Badge>Kampagne: {l.utm_campaign}</Badge>}
                      {l.interest_package && <Badge>📦 {l.interest_package}</Badge>}
                      {l.follow_up_at && (
                        <Badge className={due ? 'bg-red-500/15 text-red-400 border-red-500/30' : ''}>
                          <CalendarClock className="w-3 h-3 inline mr-1" />
                          Follow-up: {new Date(l.follow_up_at).toLocaleDateString('de-DE')}
                        </Badge>
                      )}
                    </div>
                  </button>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                    <button onClick={() => setActive(l)} className="flex-1 px-3 py-1.5 rounded-md border border-border text-xs hover:bg-foreground/5">Details</button>
                    {l.email && (
                      <a href={`mailto:${l.email}`} className="flex-1 px-3 py-1.5 rounded-md bg-foreground/5 border border-border text-xs text-center hover:bg-foreground/10 inline-flex items-center justify-center gap-1.5">
                        <Mail className="w-3 h-3" /> E-Mail
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="bg-card clean-border rounded-xl p-8 text-center">
                <div className="font-semibold mb-1">{leads.length === 0 ? 'Noch keine Anfragen eingegangen' : 'Keine Anfragen passen zum Filter'}</div>
                <p className="text-sm text-muted-foreground">{leads.length === 0 ? 'Sobald Besucher das Kontaktformular ausfüllen, erscheinen die Anfragen hier.' : 'Filter oder Suche anpassen, um andere Anfragen zu sehen.'}</p>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit max-h-[calc(100vh-7rem)] overflow-y-auto">
            {active ? (
              <div className="bg-card clean-border rounded-xl p-6 space-y-5">
                <div>
                  <div className="text-lg font-black">{active.name}</div>
                  <a href={`mailto:${active.email}`} className="text-sm underline inline-flex items-center gap-1"><Mail className="w-3 h-3" />{active.email}</a>
                </div>

                <Section title="Lead-Informationen">
                  <Detail label="Unternehmen" value={active.company} />
                  <Detail label="Telefon" value={active.phone} />
                  <Detail label="Produktlink" value={active.product_url} link />
                  <Detail label="Produkttyp" value={active.product_type} />
                  <Detail label="Ziel" value={active.project_goal} />
                  <Detail label="Budget" value={active.budget} />
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">Nachricht</div>
                    <div className="text-sm whitespace-pre-wrap">{active.message}</div>
                  </div>
                </Section>

                <Section title="Attribution">
                  {[active.referrer_domain, active.utm_source, active.utm_medium, active.utm_campaign, active.utm_content, active.utm_term, active.landing_page, active.conversion_page, active.device_type, active.interest_package].every(v => !v) ? (
                    <div className="text-xs text-muted-foreground italic">Keine Attribution-Daten erfasst.</div>
                  ) : (
                    <>
                      <Detail label="Referrer" value={active.referrer_domain} />
                      <Detail label="UTM Source" value={active.utm_source} />
                      <Detail label="UTM Medium" value={active.utm_medium} />
                      <Detail label="UTM Campaign" value={active.utm_campaign} />
                      <Detail label="UTM Content" value={active.utm_content} />
                      <Detail label="UTM Term" value={active.utm_term} />
                      <Detail label="Landing Page" value={active.landing_page} />
                      <Detail label="Conversion Page" value={active.conversion_page} />
                      <Detail label="Gerät" value={active.device_type} />
                      <Detail label="Paketinteresse" value={active.interest_package} />
                    </>
                  )}
                </Section>

                <Section title="Mini-CRM">
                  <div>
                    <label className="text-xs uppercase text-muted-foreground block mb-1">Status</label>
                    <select value={active.status} onChange={e => update(active.id, { status: e.target.value })} className="w-full px-3 py-2 rounded-md bg-background border border-border">
                      {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-muted-foreground block mb-1 flex items-center gap-1"><Flag className="w-3 h-3" /> Priorität</label>
                    <select value={active.lead_priority ?? 'normal'} onChange={e => update(active.id, { lead_priority: e.target.value })} className="w-full px-3 py-2 rounded-md bg-background border border-border">
                      {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-muted-foreground block mb-1 flex items-center gap-1"><CalendarClock className="w-3 h-3" /> Follow-up am</label>
                    <input type="datetime-local"
                      value={active.follow_up_at ? new Date(active.follow_up_at).toISOString().slice(0, 16) : ''}
                      onChange={e => update(active.id, { follow_up_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      className="w-full px-3 py-2 rounded-md bg-background border border-border" />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-muted-foreground block mb-1">Interne Notizen <span className="text-[10px] normal-case text-muted-foreground/70">(nur Admin sichtbar)</span></label>
                    <textarea rows={4} defaultValue={active.internal_notes ?? ''} key={active.id}
                      onBlur={e => { if (e.target.value !== (active.internal_notes ?? '')) update(active.id, { internal_notes: e.target.value }) }}
                      className="w-full px-3 py-2 rounded-md bg-background border border-border" />
                  </div>
                </Section>

                <Section title="Statusverlauf">
                  {history.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic">Noch keine Statusänderungen.</div>
                  ) : (
                    <ol className="space-y-2">
                      {history.map(h => (
                        <li key={h.id} className="text-xs flex items-center gap-2">
                          <span className="text-muted-foreground tabular-nums w-32 shrink-0">{new Date(h.changed_at).toLocaleString('de-DE')}</span>
                          <span className="text-muted-foreground">{h.old_status ? (STATUS[h.old_status] ?? h.old_status) : '—'}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-semibold">{STATUS[h.new_status] ?? h.new_status}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </Section>

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
function normalizeHref(value: string): string {
  const v = value.trim()
  if (/^(https?:)?\/\//i.test(v)) return v.startsWith('//') ? `https:${v}` : v
  if (/^(mailto:|tel:)/i.test(v)) return v
  return `https://${v.replace(/^\/+/, '')}`
}
function Detail({ label, value, link }: { label: string; value: string | null; link?: boolean }) {
  if (!value) return null
  return <div>
    <div className="text-xs uppercase text-muted-foreground">{label}</div>
    {link ? <a href={normalizeHref(value)} target="_blank" rel="noopener noreferrer" className="text-sm underline break-all inline-flex items-center gap-1">{value}<ExternalLink className="w-3 h-3" /></a>
          : <div className="text-sm break-words">{value}</div>}
  </div>
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t border-border/50 pt-4 first:border-t-0 first:pt-0">
      <div className="text-xs font-bold uppercase tracking-wider text-[#C9963B]">{title}</div>
      {children}
    </div>
  )
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="text-xs flex items-center gap-2 bg-card border border-border rounded-md px-2 py-1.5">
      <span className="text-muted-foreground">{label}:</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent text-sm focus:outline-none">
        {options.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </label>
  )
}
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-block text-[10px] px-2 py-0.5 rounded border border-border bg-background/50 ${className ?? ''}`}>{children}</span>
}
