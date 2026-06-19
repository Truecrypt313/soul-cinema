'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { TrendingUp, Eye, MousePointerClick, Users, Inbox, Smartphone, Monitor, Tablet, AlertTriangle } from 'lucide-react'

type Ev = {
  id: string
  event_name: string
  page_path: string | null
  cta_id: string | null
  section_key: string | null
  visitor_hash: string | null
  device_type: string | null
  browser_name: string | null
  os_name: string | null
  referrer_domain: string | null
  utm_source: string | null
  utm_campaign: string | null
  theme: string | null
  metadata: any
  created_at: string
}

type Settings = {
  analytics_enabled: boolean
  track_page_views: boolean
  track_cta_clicks: boolean
  track_section_views: boolean
  track_form_events: boolean
  track_referrers: boolean
  track_device: boolean
  track_theme: boolean
  retention_days: number
  bot_filter_enabled: boolean
}

const RANGES = [
  { key: '1d', label: 'Heute', days: 1 },
  { key: '7d', label: '7 Tage', days: 7 },
  { key: '30d', label: '30 Tage', days: 30 },
  { key: '90d', label: '90 Tage', days: 90 },
] as const

export default function AdminAnalytics() {
  const [days, setDays] = useState<number>(7)
  const [events, setEvents] = useState<Ev[]>([])
  const [leadsCount, setLeadsCount] = useState(0)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saltConfigured, setSaltConfigured] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const pid = (import.meta as any).env?.VITE_SUPABASE_PROJECT_ID
    if (!pid) return
    fetch(`https://${pid}.supabase.co/functions/v1/track-analytics-event`, { method: 'GET' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setSaltConfigured(!!d.salt_configured) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      const since = new Date(Date.now() - days * 86400000).toISOString()
      const [{ data: evs }, { count }, { data: st }] = await Promise.all([
        supabase.from('analytics_events').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(20000),
        supabase.from('contact_leads').select('*', { count: 'exact', head: true }).gte('created_at', since),
        supabase.from('analytics_settings').select('*').eq('id', 1).maybeSingle(),
      ])
      if (!active) return
      setEvents((evs as Ev[]) ?? [])
      setLeadsCount(count ?? 0)
      setSettings((st as Settings) ?? null)
      setLoading(false)
    })()
    return () => { active = false }
  }, [days])

  const k = useMemo(() => {
    const byName = (n: string) => events.filter(e => e.event_name === n)
    const uniqVisitors = new Set(events.filter(e => e.event_name === 'page_view' && e.visitor_hash).map(e => e.visitor_hash!)).size
    const pageViews = byName('page_view').length
    const ctaClicks = events.filter(e => ['cta_click', 'pricing_cta_click', 'external_link_click'].includes(e.event_name)).length
    const contactViews = byName('contact_view').length
    const contactStarts = byName('contact_start').length
    const contactSubs = byName('contact_submit_success').length
    const contactErrs = byName('contact_submit_error').length
    const conversion = uniqVisitors > 0 ? (leadsCount / uniqVisitors) * 100 : 0

    const groupBy = (key: keyof Ev) => {
      const m = new Map<string, number>()
      for (const e of events) {
        const v = (e[key] as string | null) || '—'
        m.set(v, (m.get(v) ?? 0) + 1)
      }
      return Array.from(m.entries()).sort((a, b) => b[1] - a[1])
    }

    const devices = { mobile: 0, desktop: 0, tablet: 0, other: 0 }
    for (const e of events) {
      if (e.event_name !== 'page_view') continue
      const d = e.device_type
      if (d === 'mobile' || d === 'desktop' || d === 'tablet') devices[d]++
      else devices.other++
    }

    const ctas = new Map<string, number>()
    for (const e of events) {
      if (!['cta_click', 'pricing_cta_click', 'external_link_click'].includes(e.event_name)) continue
      const id = e.cta_id ?? (e.metadata?.target ?? e.metadata?.package_slug ?? e.event_name)
      ctas.set(id, (ctas.get(id) ?? 0) + 1)
    }
    const ctaList = Array.from(ctas.entries()).sort((a, b) => b[1] - a[1])

    // Content insights (Phase B)
    const sections = new Map<string, number>()
    for (const e of events) {
      if (e.event_name !== 'section_view') continue
      const key = e.section_key ?? '—'
      sections.set(key, (sections.get(key) ?? 0) + 1)
    }
    const sectionList = Array.from(sections.entries()).sort((a, b) => b[1] - a[1])

    const faqs = new Map<string, number>()
    for (const e of events) {
      if (e.event_name !== 'faq_open') continue
      const id = e.metadata?.faq_id ?? '—'
      faqs.set(String(id), (faqs.get(String(id)) ?? 0) + 1)
    }
    const faqList = Array.from(faqs.entries()).sort((a, b) => b[1] - a[1])

    const sectionViews = events.filter(e => e.event_name === 'section_view').length
    const faqOpens = events.filter(e => e.event_name === 'faq_open').length

    return {
      uniqVisitors, pageViews, ctaClicks, contactViews, contactStarts, contactSubs, contactErrs, conversion,
      referrers: groupBy('referrer_domain').slice(0, 10),
      utms: groupBy('utm_source').slice(0, 10),
      browsers: groupBy('browser_name').slice(0, 8),
      os: groupBy('os_name').slice(0, 8),
      devices,
      ctaList,
      sectionList,
      faqList,
      sectionViews,
      faqOpens,
    }
  }, [events, leadsCount])

  const KPI = ({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string | number; hint?: string }) => (
    <div className="bg-card clean-border rounded-xl p-5">
      <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="text-3xl font-black mt-1.5 text-foreground">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  )

  const updateSetting = async (patch: Partial<Settings>) => {
    if (!settings) return
    setSettings({ ...settings, ...patch })
    await supabase.from('analytics_settings').update(patch).eq('id', 1)
  }

  const funnel = [
    { label: 'Besucher (unique)', value: k.uniqVisitors },
    { label: 'CTA-Klicks', value: k.ctaClicks },
    { label: 'Kontakt gesehen', value: k.contactViews },
    { label: 'Formular gestartet', value: k.contactStarts },
    { label: 'Formular gesendet', value: k.contactSubs },
    { label: 'Leads gespeichert', value: leadsCount },
  ]
  const funnelMax = Math.max(1, ...funnel.map(f => f.value))

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 className="text-3xl font-black">Analytics</h1>
        <div className="flex gap-1 bg-card clean-border rounded-md p-1">
          {RANGES.map(r => (
            <button key={r.key} onClick={() => setDays(r.days)}
              className={`px-3 py-1.5 text-xs font-semibold rounded ${days === r.days ? 'bg-[#C9963B] text-[#0A0A0A]' : 'text-muted-foreground hover:text-foreground'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-6">First-Party-Analytics. Keine Cookies, keine Drittanbieter. Werte sind Näherungen.</p>

      {settings && !settings.analytics_enabled && (
        <div className="mb-6 flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm">
          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
          <div>Analytics ist aktuell <strong>deaktiviert</strong>. Es werden keine neuen Events erfasst.</div>
        </div>
      )}

      {saltConfigured === false && (
        <div className="mb-6 flex items-start gap-3 bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-sm">
          <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
          <div>
            <strong>ANALYTICS_SALT ist nicht gesetzt.</strong> Es wird ein unsicherer Default-Salt verwendet.
            Bitte in den Edge-Function-Secrets <code className="px-1 bg-background rounded">ANALYTICS_SALT</code> auf einen langen Zufallswert (≥ 32 Zeichen) setzen, damit Visitor-Hashes nicht erraten werden können.
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPI icon={Users} label="Besucher" value={k.uniqVisitors} hint="Unique (anonym, tageshash)" />
        <KPI icon={Eye} label="Pageviews" value={k.pageViews} />
        <KPI icon={MousePointerClick} label="CTA-Klicks" value={k.ctaClicks} />
        <KPI icon={Inbox} label="Leads" value={leadsCount} hint={`Conversion ${k.conversion.toFixed(2)} %`} />
      </div>

      {/* Funnel */}
      <section className="bg-card clean-border rounded-xl p-5 mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#C9963B]" /> Conversion Funnel</h2>
        <div className="space-y-2.5">
          {funnel.map((f, i) => {
            const pct = (f.value / funnelMax) * 100
            const prev = i > 0 ? funnel[i - 1].value : null
            const drop = prev && prev > 0 ? ((f.value / prev) * 100).toFixed(0) + ' %' : null
            return (
              <div key={f.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{f.label}</span>
                  <span className="text-muted-foreground">{f.value}{drop && <span className="ml-2 text-[11px] text-[#C9963B]">{drop}</span>}</span>
                </div>
                <div className="h-2.5 rounded-full bg-background overflow-hidden">
                  <div className="h-full bg-[#C9963B]/80" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Traffic */}
        <section className="bg-card clean-border rounded-xl p-5">
          <h2 className="text-lg font-bold mb-3">Traffic-Quellen</h2>
          <Table rows={k.referrers} emptyText="Noch keine Referrer." labelCol="Domain" />
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mt-5 mb-2">UTM Source</h3>
          <Table rows={k.utms} emptyText="Keine UTM-Kampagnen erfasst." labelCol="utm_source" />
        </section>

        {/* Devices */}
        <section className="bg-card clean-border rounded-xl p-5">
          <h2 className="text-lg font-bold mb-3">Geräte</h2>
          <div className="grid grid-cols-3 gap-2 mb-5">
            <DeviceCard icon={Smartphone} label="Mobile" value={k.devices.mobile} />
            <DeviceCard icon={Monitor} label="Desktop" value={k.devices.desktop} />
            <DeviceCard icon={Tablet} label="Tablet" value={k.devices.tablet} />
          </div>
          <Table rows={k.browsers} emptyText="—" labelCol="Browser" />
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mt-5 mb-2">OS</h3>
          <Table rows={k.os} emptyText="—" labelCol="OS" />
        </section>
      </div>

      {/* CTA Performance */}
      <section className="bg-card clean-border rounded-xl p-5 mb-6">
        <h2 className="text-lg font-bold mb-3">CTA-Performance</h2>
        <Table rows={k.ctaList} emptyText="Noch keine CTA-Klicks." labelCol="CTA" />
      </section>

      {/* Settings */}
      {settings && (
        <section className="bg-card clean-border rounded-xl p-5">
          <h2 className="text-lg font-bold mb-1">Analytics-Einstellungen</h2>
          <p className="text-xs text-muted-foreground mb-4">Greifen sofort. Wenn deaktiviert, werden keine Events mehr gespeichert.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {([
              ['analytics_enabled', 'Analytics aktiviert'],
              ['track_page_views', 'Pageviews tracken'],
              ['track_cta_clicks', 'CTA-Klicks tracken'],
              ['track_section_views', 'Section-Views tracken (rauscht)'],
              ['track_form_events', 'Formular-Events tracken'],
              ['track_referrers', 'Referrer / UTM tracken'],
              ['track_device', 'Gerätetyp grob tracken'],
              ['track_theme', 'Theme-Nutzung tracken'],
              ['bot_filter_enabled', 'Bot-Filter aktiv'],
            ] as [keyof Settings, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between gap-3 bg-background rounded-md px-3 py-2.5 border border-border">
                <span className="text-sm">{label}</span>
                <input type="checkbox" checked={Boolean(settings[key])} onChange={e => updateSetting({ [key]: e.target.checked } as any)} className="w-4 h-4 accent-[#C9963B]" />
              </label>
            ))}
            <label className="flex items-center justify-between gap-3 bg-background rounded-md px-3 py-2.5 border border-border sm:col-span-2">
              <span className="text-sm">Aufbewahrungsdauer (Tage)</span>
              <input type="number" min={7} max={730} value={settings.retention_days}
                onChange={e => updateSetting({ retention_days: Math.max(7, Math.min(730, Number(e.target.value) || 180)) })}
                className="w-24 bg-card border border-border rounded px-2 py-1 text-right" />
            </label>
          </div>
        </section>
      )}

      {loading && <div className="text-sm text-muted-foreground mt-4">Lade…</div>}
    </div>
  )
}

function Table({ rows, labelCol, emptyText }: { rows: [string, number][]; labelCol: string; emptyText: string }) {
  if (!rows.length) return <div className="text-sm text-muted-foreground">{emptyText}</div>
  const max = Math.max(...rows.map(r => r[1]))
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{labelCol}</span><span>Events</span>
      </div>
      {rows.map(([label, n]) => (
        <div key={label}>
          <div className="flex justify-between text-sm">
            <span className="truncate pr-2">{label || '—'}</span>
            <span className="text-muted-foreground tabular-nums">{n}</span>
          </div>
          <div className="h-1 rounded-full bg-background overflow-hidden mt-0.5">
            <div className="h-full bg-[#C9963B]/60" style={{ width: `${(n / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function DeviceCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="bg-background rounded-md p-3 border border-border text-center">
      <Icon className="w-4 h-4 mx-auto text-[#C9963B]" />
      <div className="text-xl font-bold mt-1">{value}</div>
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
    </div>
  )
}
