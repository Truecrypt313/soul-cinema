'use client'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Inbox, Briefcase, FileText, HelpCircle, Tag, Star, AlertTriangle, Lightbulb } from 'lucide-react'

type Lead = { id: string; name: string; email: string; status: string; created_at: string; message: string }

const REQUIRED = ['hero_video_url', 'contact_email', 'og_image_url', 'seo_title', 'seo_description']
const PLACEHOLDER_VIDEO = 'mojli.s3.us-east-2.amazonaws.com'

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [missing, setMissing] = useState<string[]>([])
  const [recs, setRecs] = useState<string[]>([])
  const [content, setContent] = useState({ portfolio: 0, services: 0, faq: 0, testimonials: 0 })

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('contact_leads').select('id,name,email,status,created_at,message').order('created_at', { ascending: false })
      const l = (data as Lead[]) ?? []
      setLeads(l)
      const c: Record<string, number> = {}
      for (const x of l) c[x.status] = (c[x.status] ?? 0) + 1
      setCounts(c)

      const { data: s } = await supabase.from('site_settings').select('key,value')
      const map: Record<string, any> = {}
      for (const r of (s as any[]) ?? []) map[r.key] = r.value
      setMissing(REQUIRED.filter(k => !map[k]))

      const [{ count: pCount }, { count: svCount }, { count: faqCount }, { count: tCount }] = await Promise.all([
        supabase.from('portfolio_items').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('services').select('*', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('faq_items').select('*', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('visible', true),
      ])
      const cn = { portfolio: pCount ?? 0, services: svCount ?? 0, faq: faqCount ?? 0, testimonials: tCount ?? 0 }
      setContent(cn)

      const r: string[] = []
      if (cn.portfolio === 0) r.push('Noch keine veröffentlichten Portfolio-Projekte. Eigene Cases steigern Vertrauen.')
      if (cn.testimonials === 0) r.push('Noch keine sichtbaren Testimonials – erste Kundenstimmen erhöhen Conversion.')
      if (typeof map.hero_video_url === 'string' && map.hero_video_url.includes(PLACEHOLDER_VIDEO)) {
        r.push('Hero-Video nutzt noch den temporären Platzhalter. Später durch eigenes Soul-Cinema-Video ersetzen.')
      }
      if (!map.whatsapp_number) r.push('WhatsApp-Nummer ist leer (optional). Direkter Kontakt erhöht Anfragequote.')
      if (!map.calendly_url) r.push('Calendly-Link ist leer (optional). Termine direkt buchen lassen erhöht Conversion.')
      setRecs(r)
    })()
  }, [])

  const Stat = ({ label, value, color = 'text-foreground' }: { label: string; value: number; color?: string }) => (
    <div className="bg-card clean-border rounded-xl p-5">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className={`text-3xl font-black mt-1 ${color}`}>{value}</div>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">Überblick über Anfragen und Inhalte.</p>

      {missing.length > 0 && (
        <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-yellow-500">Fehlende Einstellungen</div>
            <div className="text-muted-foreground mt-1">
              Diese Felder sind nicht gepflegt: {missing.map(m => <code key={m} className="text-xs px-1.5 py-0.5 bg-background rounded mx-0.5">{m}</code>)}.
              <Link to="/admin/einstellungen" className="ml-2 underline hover:text-foreground">Jetzt pflegen →</Link>
            </div>
          </div>
        </div>
      )}

      {recs.length > 0 && (
        <div className="mb-6 bg-[#C9963B]/10 border border-[#C9963B]/30 rounded-xl p-4 text-sm flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[#C9963B] shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-[#C9963B]">Empfehlungen</div>
            <ul className="text-muted-foreground mt-1 space-y-1 list-disc pl-4">
              {recs.map(r => <li key={r}>{r}</li>)}
            </ul>
          </div>
        </div>
      )}

      <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Anfragen</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Stat label="Neu" value={counts.new ?? 0} color="text-[#C9963B]" />
        <Stat label="Kontaktiert" value={counts.contacted ?? 0} />
        <Stat label="In Gespräch" value={counts.in_talks ?? 0} />
        <Stat label="Gewonnen" value={counts.won ?? 0} color="text-green-500" />
        <Stat label="Verloren" value={counts.lost ?? 0} color="text-muted-foreground" />
      </div>

      <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Inhalte</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat label="Portfolio veröffentlicht" value={content.portfolio} />
        <Stat label="Leistungen sichtbar" value={content.services} />
        <Stat label="FAQ sichtbar" value={content.faq} />
        <Stat label="Testimonials sichtbar" value={content.testimonials} />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <h2 className="text-lg font-bold mb-3">Letzte Anfragen</h2>
          <div className="space-y-2">
            {leads.slice(0, 5).map(l => (
              <Link key={l.id} to="/admin/anfragen" className="block bg-card clean-border rounded-lg p-4 hover:border-[#C9963B]/40">
                <div className="flex justify-between gap-3">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString('de-DE')}</div>
                </div>
                <div className="text-sm text-muted-foreground truncate">{l.email} — {l.message}</div>
              </Link>
            ))}
            {leads.length === 0 && <div className="text-muted-foreground text-sm">Noch keine Anfragen.</div>}
          </div>
        </div>

        <aside>
          <h2 className="text-lg font-bold mb-3">Schnellzugriff</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { to: '/admin/anfragen', icon: Inbox, label: 'Anfragen' },
              { to: '/admin/portfolio', icon: Briefcase, label: 'Portfolio' },
              { to: '/admin/preise', icon: Tag, label: 'Preise' },
              { to: '/admin/faq', icon: HelpCircle, label: 'FAQ' },
              { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
              { to: '/admin/einstellungen', icon: FileText, label: 'Einstellungen' },
            ].map(q => (
              <Link key={q.to} to={q.to} className="bg-card clean-border rounded-lg p-3 flex items-center gap-2 hover:border-[#C9963B]/40">
                <q.icon className="w-4 h-4 text-[#C9963B]" />
                <span className="text-sm font-medium">{q.label}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
