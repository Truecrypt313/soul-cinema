'use client'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Inbox, Briefcase, FileText, HelpCircle, Tag, Star, AlertTriangle, Lightbulb, CheckCircle2, Circle } from 'lucide-react'

type Lead = { id: string; name: string; email: string; status: string; created_at: string; message: string }

const PLACEHOLDER_VIDEO = 'mojli.s3.us-east-2.amazonaws.com'

type CheckItem = { key: string; label: string; done: boolean; optional?: boolean; to?: string; hint?: string }

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [checklist, setChecklist] = useState<CheckItem[]>([])
  const [recs, setRecs] = useState<{ tone: 'warn' | 'info'; text: string }[]>([])
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

      const [{ count: pCount }, { count: svCount }, { count: faqCount }, { count: tCount }] = await Promise.all([
        supabase.from('portfolio_items').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('services').select('*', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('faq_items').select('*', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('visible', true),
      ])
      const cn = { portfolio: pCount ?? 0, services: svCount ?? 0, faq: faqCount ?? 0, testimonials: tCount ?? 0 }
      setContent(cn)

      const heroPlaceholder = typeof map.hero_video_url === 'string' && map.hero_video_url.includes(PLACEHOLDER_VIDEO)
      const items: CheckItem[] = [
        { key: 'hero_video', label: 'Hero-Video gepflegt', done: !!map.hero_video_url && !heroPlaceholder, to: '/admin/einstellungen', hint: heroPlaceholder ? 'Aktuell temporäres Material – später durch eigenes Soul-Cinema-Video ersetzen.' : undefined },
        { key: 'hero_poster_mobile', label: 'Mobile Hero-Poster (optional)', done: !!map.hero_poster_mobile_url, optional: true, to: '/admin/einstellungen' },
        { key: 'portfolio_3', label: 'Mindestens 3 veröffentlichte Projekte', done: cn.portfolio >= 3, to: '/admin/portfolio', hint: cn.portfolio < 3 ? `Aktuell ${cn.portfolio} – bis dahin zeigt die Website Beispiel-Formate.` : undefined },
        { key: 'testimonial_1', label: 'Mindestens 1 echtes Testimonial', done: cn.testimonials >= 1, to: '/admin/testimonials' },
        { key: 'og_image', label: 'OG-Bild gepflegt', done: !!map.og_image_url, to: '/admin/einstellungen' },
        { key: 'seo_title', label: 'SEO Title gepflegt', done: !!map.seo_title, to: '/admin/einstellungen' },
        { key: 'seo_description', label: 'SEO Description gepflegt', done: !!map.seo_description, to: '/admin/einstellungen' },
        { key: 'contact_email', label: 'Kontakt-E-Mail gepflegt', done: !!map.contact_email, to: '/admin/einstellungen' },
        { key: 'whatsapp', label: 'WhatsApp (optional)', done: !!map.whatsapp_number, optional: true, to: '/admin/einstellungen' },
        { key: 'calendly', label: 'Calendly (optional)', done: !!map.calendly_url, optional: true, to: '/admin/einstellungen' },
        { key: 'setup_code', label: 'Admin-Setup-Code deaktiviert', done: !map.admin_setup_code, to: '/admin/einstellungen', hint: map.admin_setup_code ? 'Setup-Code ist noch aktiv. Nach erfolgreichem Setup leeren.' : undefined },
      ]
      setChecklist(items)

      const r: { tone: 'warn' | 'info'; text: string }[] = []
      if (cn.portfolio < 3) r.push({ tone: 'info', text: `Weniger als 3 veröffentlichte Portfolio-Projekte (${cn.portfolio}). Solange das so ist, zeigt die Landingpage „Beispiel-Formate“ statt echter Cases.` })
      if (cn.testimonials === 0) r.push({ tone: 'info', text: 'Keine echten Kundenstimmen veröffentlicht. Die Testimonials-Sektion bleibt auf der Website ausgeblendet.' })
      if (!map.og_image_url) r.push({ tone: 'warn', text: 'OG-Bild fehlt. Social Shares wirken ohne Vorschaubild weniger hochwertig.' })
      if (heroPlaceholder) r.push({ tone: 'info', text: 'Aktuelles Hero-Video ist temporär. Später eigenes Soul-Cinema-Material einfügen.' })
      if (!map.contact_email) r.push({ tone: 'warn', text: 'Kontakt-E-Mail fehlt. Bitte in Einstellungen ergänzen, sonst gehen Anfrage-Benachrichtigungen ins Leere.' })
      if (!map.whatsapp_number) r.push({ tone: 'info', text: 'Optional: WhatsApp-Nummer kann später ergänzt werden.' })
      if (!map.calendly_url) r.push({ tone: 'info', text: 'Optional: Calendly-Link kann später ergänzt werden.' })
      setRecs(r)
    })()
  }, [])

  const required = checklist.filter(c => !c.optional)
  const doneRequired = required.filter(c => c.done).length
  const progress = required.length ? Math.round((doneRequired / required.length) * 100) : 0

  const Stat = ({ label, value, color = 'text-foreground' }: { label: string; value: number; color?: string }) => (
    <div className="bg-card clean-border rounded-xl p-5">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className={`text-3xl font-black mt-1 ${color}`}>{value}</div>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">Überblick über Anfragen, Inhalte und Setup-Status.</p>

      {/* Setup checklist */}
      <section className="mb-8 bg-card clean-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold">Setup-Checkliste</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Optionale Punkte zählen nicht in den Fortschritt.</p>
          </div>
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex-1 h-2 rounded-full bg-background overflow-hidden">
              <div className="h-full bg-[#C9963B] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-sm font-semibold text-[#C9963B] whitespace-nowrap">{doneRequired}/{required.length} · {progress}%</div>
          </div>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2">
          {checklist.map(c => (
            <li key={c.key} className="flex items-start gap-2.5 text-sm">
              {c.done
                ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                : <Circle className={`w-4 h-4 shrink-0 mt-0.5 ${c.optional ? 'text-muted-foreground/50' : 'text-yellow-500'}`} />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={c.done ? 'text-muted-foreground' : ''}>{c.label}</span>
                  {c.optional && <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 bg-foreground/5 px-1.5 rounded">optional</span>}
                  {!c.done && c.to && <Link to={c.to} className="text-[11px] text-[#C9963B] hover:underline">pflegen →</Link>}
                </div>
                {c.hint && <div className="text-[11px] text-muted-foreground mt-0.5">{c.hint}</div>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {recs.length > 0 && (
        <div className="mb-8 bg-[#C9963B]/8 border border-[#C9963B]/25 rounded-xl p-4 text-sm flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[#C9963B] shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-[#C9963B] mb-1">Empfehlungen</div>
            <ul className="text-muted-foreground space-y-1">
              {recs.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  {r.tone === 'warn'
                    ? <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                    : <Lightbulb className="w-3.5 h-3.5 text-[#C9963B]/70 mt-0.5 shrink-0" />}
                  <span>{r.text}</span>
                </li>
              ))}
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
