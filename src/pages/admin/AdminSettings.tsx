'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Image as ImageIcon } from 'lucide-react'
import { parseBool, parseVolume, resolveAudioUrl } from '@/lib/audioMedia'

type Setting = { key: string; label: string; type?: 'text' | 'textarea' | 'list' | 'url' | 'email' | 'switch' | 'number'; hint?: string; group: string; rows?: number; placeholder?: string }

const FIELDS: Setting[] = [
  // ─── Hero ─────────────────────────────────────────────
  { key: 'hero_badge', label: 'Hero Badge', group: 'Hero', placeholder: 'z. B. Ad Studio für Produktvideos & Social Ads' },
  { key: 'hero_headline', label: 'Hero Headline', type: 'textarea', rows: 2, group: 'Hero' },
  { key: 'hero_subline', label: 'Hero Subline (Desktop)', type: 'textarea', rows: 3, group: 'Hero' },
  { key: 'hero_subline_mobile', label: 'Hero Subline (Mobile, kurz)', type: 'textarea', rows: 2, group: 'Hero', hint: 'Optional. Kürzere Version für Handy. Wenn leer, wird der Standard-Mobile-Text genutzt.' },
  { key: 'hero_secondary_line', label: 'Hero zweite Zeile (nur Desktop)', type: 'textarea', rows: 2, group: 'Hero', hint: 'Wird auf Mobile ausgeblendet.' },
  { key: 'hero_bullets', label: 'Hero Bullet Points', type: 'list', group: 'Hero', hint: 'Auf Mobile werden nur die ersten 2 Bullets angezeigt.' },
  { key: 'hero_video_url', label: 'Hero Video URL', type: 'url', group: 'Hero', hint: 'Aktuelles Hero-Video ist temporär und kann später durch eigenes Material ersetzt werden. Empfohlen: .mp4 oder .webm.' },
  { key: 'hero_poster_url', label: 'Hero Poster (Bild) URL', type: 'url', group: 'Hero', hint: 'Optional. Wird vor dem Video angezeigt, bis es geladen ist.' },
  { key: 'hero_poster_mobile_url', label: 'Mobile Hero Poster URL', type: 'url', group: 'Hero', hint: 'Optional. Wenn leer, wird das normale Poster oder Video genutzt.' },
  { key: 'primary_cta_label', label: 'Primärer CTA — Text', group: 'Hero', placeholder: 'Projekt anfragen' },
  { key: 'secondary_cta_label', label: 'Sekundärer CTA — Text', group: 'Hero', placeholder: 'Portfolio ansehen' },

  // ─── Musik & Audio ────────────────────────────────────
  { key: 'music_enabled', label: 'Musik aktivieren', type: 'switch', group: 'Musik & Audio', hint: 'Aktiviert den Soundtrack auf der Main Page. Autoplay mit Ton wird von Browsern blockiert — Musik startet erst nach Klick auf den Sound-Button.' },
  { key: 'music_url', label: 'Musik-URL', type: 'url', group: 'Musik & Audio', placeholder: 'https://.../soundtrack.mp3 oder /media/audio/soundtrack.mp3', hint: 'Direktlink zu MP3, WebM, OGG oder gültigem Storage-Pfad. Empfohlen: weboptimierte MP3.' },
  { key: 'music_volume', label: 'Lautstärke (0.0 – 1.0)', type: 'number', group: 'Musik & Audio', placeholder: '0.35', hint: 'Wert zwischen 0.0 und 1.0. Empfohlen: 0.25 – 0.40.' },
  { key: 'music_loop', label: 'Wiederholen (Loop)', type: 'switch', group: 'Musik & Audio', hint: 'Wenn aktiv, läuft die Musik im Loop.' },
  { key: 'music_label', label: 'Button-Label', type: 'text', group: 'Musik & Audio', placeholder: 'Soundtrack', hint: 'Wird für Tooltip / aria-label des Musik-Buttons verwendet.' },
  { key: 'music_show_control', label: 'Sound-Button anzeigen', type: 'switch', group: 'Musik & Audio', hint: 'Wenn deaktiviert, wird kein Musik-Button im Hero angezeigt.' },

  // ─── Kontakt ──────────────────────────────────────────
  { key: 'contact_email', label: 'Kontakt-E-Mail', type: 'email', group: 'Kontakt', placeholder: 'hallo@soulcinema.de' },
  { key: 'contact_phone', label: 'Telefon (optional)', group: 'Kontakt', placeholder: '+49 …' },
  { key: 'whatsapp_number', label: 'WhatsApp-Nummer (optional)', group: 'Kontakt', hint: 'Mit Ländervorwahl, ohne Sonderzeichen, z. B. 491701234567. Leer lassen, um zu verstecken.' },
  { key: 'calendly_url', label: 'Calendly-Link (optional)', type: 'url', group: 'Kontakt', hint: 'Leer lassen, um zu verstecken.' },
  { key: 'contact_response_time', label: 'Antwortzeit-Text', group: 'Kontakt', placeholder: 'z. B. Antwort innerhalb 24 h' },
  { key: 'contact_hint', label: 'Kontakt-Hinweistext', type: 'textarea', rows: 2, group: 'Kontakt', hint: 'Optionaler Hinweis über/unter dem Kontaktformular.' },

  // ─── SEO & Social ─────────────────────────────────────
  { key: 'seo_title', label: 'SEO Title', group: 'SEO & Social', hint: 'Wird im Browser-Tab und in den Social-Cards verwendet. Max. 60 Zeichen empfohlen.' },
  { key: 'seo_description', label: 'SEO Description', type: 'textarea', rows: 2, group: 'SEO & Social', hint: 'Max. 160 Zeichen empfohlen.' },
  { key: 'og_title', label: 'OG Title (Social)', group: 'SEO & Social', hint: 'Wenn leer, wird der SEO Title verwendet.' },
  { key: 'og_description', label: 'OG Description (Social)', type: 'textarea', rows: 2, group: 'SEO & Social', hint: 'Wenn leer, wird die SEO Description verwendet.' },
  { key: 'og_image_url', label: 'OG Image URL', type: 'url', group: 'SEO & Social', hint: 'Empfohlen: 1200 × 630 px.' },
  { key: 'canonical_url', label: 'Canonical URL (optional)', type: 'url', group: 'SEO & Social', placeholder: 'https://soulcinema.de' },

  // ─── Footer & Social Links ────────────────────────────
  { key: 'footer_text', label: 'Footer Claim', type: 'textarea', rows: 3, group: 'Footer & Social' },
  { key: 'social_instagram', label: 'Instagram URL', type: 'url', group: 'Footer & Social', placeholder: 'https://instagram.com/…' },
  { key: 'social_tiktok', label: 'TikTok URL', type: 'url', group: 'Footer & Social', placeholder: 'https://tiktok.com/@…' },
  { key: 'social_linkedin', label: 'LinkedIn URL', type: 'url', group: 'Footer & Social', placeholder: 'https://linkedin.com/company/…' },
  { key: 'social_youtube', label: 'YouTube URL (optional)', type: 'url', group: 'Footer & Social', placeholder: 'https://youtube.com/@…' },

  // ─── E-Mail-Benachrichtigungen ────────────────────────
  { key: 'lead_email_notifications_enabled', label: 'E-Mail-Benachrichtigung bei neuer Anfrage', type: 'text', group: 'E-Mail', hint: 'true = aktiviert, false = deaktiviert. Standard: aktiviert.' },
  { key: 'lead_notification_email', label: 'Empfänger-E-Mail', type: 'email', group: 'E-Mail', placeholder: 'hallo@soulcinema.de' },
  { key: 'smtp_from_name', label: 'Absender-Name', group: 'E-Mail', placeholder: 'Soul Cinema' },
  { key: 'smtp_from_email', label: 'Absender-E-Mail', type: 'email', group: 'E-Mail', placeholder: 'hallo@soulcinema.de', hint: 'Muss zur STRATO-Mailbox passen, deren Zugangsdaten als Secret hinterlegt sind.' },

  // ─── System ───────────────────────────────────────────
  { key: 'admin_setup_code', label: 'Admin-Setup-Code', group: 'System', hint: 'Nach Aktivierung des ersten Admins bitte leeren – sonst kann jeder mit dem Code ein weiteres Admin-Konto beanspruchen.' },
]

const GROUPS = ['Hero', 'Musik & Audio', 'Kontakt', 'SEO & Social', 'Footer & Social', 'E-Mail', 'System'] as const

export default function AdminSettings() {
  const { toast } = useToast()
  const [values, setValues] = useState<Record<string, any>>({})
  const [dirty, setDirty] = useState<Record<string, boolean>>({})
  const [tab, setTab] = useState<typeof GROUPS[number]>('Hero')
  const [advanced, setAdvanced] = useState(false)
  const [raw, setRaw] = useState<{ key: string; value: any }[]>([])

  const load = async () => {
    const { data } = await supabase.from('site_settings').select('*').order('key')
    const map: Record<string, any> = {}
    for (const r of (data as any[]) ?? []) map[r.key] = r.value
    setValues(map); setRaw((data as any[]) ?? []); setDirty({})
  }
  useEffect(() => { load() }, [])

  const setVal = (k: string, v: any) => { setValues(prev => ({ ...prev, [k]: v })); setDirty(prev => ({ ...prev, [k]: true })) }

  const saveOne = async (key: string) => {
    const { error } = await supabase.from('site_settings').upsert({ key, value: values[key] ?? '' })
    if (error) { toast({ title: 'Speichern fehlgeschlagen', description: error.message, variant: 'destructive' }); return false }
    setDirty(prev => ({ ...prev, [key]: false }))
    return true
  }

  const saveTab = async () => {
    const keys = FIELDS.filter(f => f.group === tab && dirty[f.key]).map(f => f.key)
    if (keys.length === 0) { toast({ title: 'Keine Änderungen' }); return }
    let ok = true
    for (const k of keys) if (!(await saveOne(k))) ok = false
    if (ok) toast({ title: 'Änderungen gespeichert' })
  }

  const tabDirty = useMemo(() => FIELDS.some(f => f.group === tab && dirty[f.key]), [dirty, tab])
  const inp = 'w-full px-3 py-2 rounded-md bg-background border border-border focus:outline-none focus:border-[#C9963B]/60'

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Einstellungen</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Texte, Kontaktdaten, SEO und Footer. Änderungen sind nach dem Speichern sofort live.
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-3">
        {GROUPS.map(g => (
          <button key={g} onClick={() => setTab(g)}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition ${
              tab === g ? 'bg-[#C9963B]/15 text-[#C9963B]' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
            }`}>
            {g}
            {FIELDS.some(f => f.group === g && dirty[f.key]) && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#C9963B]" />}
          </button>
        ))}
      </div>

      {/* Hero preview */}
      {tab === 'Hero' && <HeroPreview values={values} />}
      {tab === 'SEO & Social' && <SocialPreview values={values} />}
      {tab === 'System' && <SystemNotes values={values} />}
      {tab === 'E-Mail' && <EmailNotes />}

      <section className="bg-card clean-border rounded-xl p-5 space-y-4">
        {FIELDS.filter(f => f.group === tab).map(f => {
          const v = values[f.key]
          return (
            <div key={f.key}>
              <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
              {f.type === 'list' ? (
                <ListEditor value={Array.isArray(v) ? v : []} onChange={(arr) => setVal(f.key, arr)} />
              ) : f.type === 'textarea' ? (
                <textarea rows={f.rows ?? 2} value={typeof v === 'string' ? v : ''} placeholder={f.placeholder} onChange={e => setVal(f.key, e.target.value)} className={inp} />
              ) : (
                <input
                  type={f.type === 'email' ? 'email' : f.type === 'url' ? 'url' : 'text'}
                  value={typeof v === 'string' ? v : ''}
                  placeholder={f.placeholder}
                  onChange={e => setVal(f.key, e.target.value)}
                  className={inp}
                />
              )}
              {f.hint && <p className="text-[11px] text-muted-foreground mt-1">{f.hint}</p>}

              {f.key === 'hero_video_url' && typeof v === 'string' && /^https?:\/\//.test(v) && (
                <div className="mt-2">
                  <video src={v} controls muted className="max-h-40 rounded border border-border" />
                </div>
              )}
              {(f.key === 'og_image_url' || f.key === 'hero_poster_url' || f.key === 'hero_poster_mobile_url') && typeof v === 'string' && /^https?:\/\//.test(v) && (
                <div className="mt-2">
                  <img src={v} alt="" loading="lazy" className="max-h-32 rounded border border-border" />
                </div>
              )}
              {dirty[f.key] && <div className="text-[11px] text-[#C9963B] mt-1">· nicht gespeichert</div>}
            </div>
          )
        })}
      </section>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 mt-6 z-10">
        <div className={`flex items-center justify-between gap-3 bg-card/95 backdrop-blur clean-border rounded-xl px-5 py-3 elevated-shadow ${tabDirty ? 'border-[#C9963B]/50' : ''}`}>
          <div className="text-sm text-muted-foreground">
            {tabDirty ? 'Du hast ungespeicherte Änderungen.' : 'Alle Änderungen gespeichert.'}
          </div>
          <button onClick={saveTab} disabled={!tabDirty}
            className="px-4 py-2 rounded-md bg-[#C9963B] text-[#0A0A0A] font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
            Änderungen speichern
          </button>
        </div>
      </div>

      <div className="mt-10">
        <button onClick={() => setAdvanced(a => !a)} className="text-sm text-muted-foreground hover:text-foreground">
          {advanced ? '▼' : '▶'} Erweitert (JSON-Editor, nur für Entwickler)
        </button>
        {advanced && (
          <div className="mt-4 space-y-3">
            {raw.map(r => (
              <details key={r.key} className="bg-card clean-border rounded-lg p-4">
                <summary className="cursor-pointer font-mono text-sm">{r.key}</summary>
                <pre className="mt-2 text-xs overflow-auto p-3 bg-background rounded">{JSON.stringify(r.value, null, 2)}</pre>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HeroPreview({ values }: { values: Record<string, any> }) {
  const badge = values.hero_badge || 'Ad Studio für Produktvideos & Social Ads'
  const headline = values.hero_headline || 'Dein Produkt. Kinoreif in Szene gesetzt.'
  const subline = values.hero_subline || 'Produktbilder, Material oder Produktlink reichen.'
  const cta = values.primary_cta_label || 'Projekt anfragen'
  const poster = values.hero_poster_url
  return (
    <div className="mb-6 bg-card clean-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">Hero-Vorschau (kompakt)</div>
      <div className="relative aspect-[16/7] bg-black flex items-end p-5 sm:p-6">
        {poster && /^https?:\/\//.test(poster) && <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-block text-[10px] uppercase tracking-wider text-[#C9963B] bg-[#C9963B]/15 px-2 py-1 rounded mb-3">{badge}</div>
          <h3 className="font-brand text-2xl sm:text-3xl text-foreground leading-tight mb-2 line-clamp-2">{headline}</h3>
          <p className="text-sm text-foreground/80 line-clamp-2 mb-3">{subline}</p>
          <span className="inline-block bg-[#C9963B] text-[#0A0A0A] font-semibold text-xs px-3 py-1.5 rounded">{cta}</span>
        </div>
      </div>
    </div>
  )
}

function SocialPreview({ values }: { values: Record<string, any> }) {
  const title = values.og_title || values.seo_title || 'Soul Cinema'
  const description = values.og_description || values.seo_description || ''
  const image = values.og_image_url
  return (
    <div className="mb-6 bg-card clean-border rounded-xl overflow-hidden max-w-xl">
      <div className="px-5 py-3 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">Social-Card Vorschau</div>
      <div className="aspect-[1200/630] bg-background flex items-center justify-center border-b border-border">
        {image && /^https?:\/\//.test(image)
          ? <img src={image} alt="" className="w-full h-full object-cover" />
          : (
            <div className="text-center p-6">
              <ImageIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">OG-Bild fehlt</div>
            </div>
          )}
      </div>
      <div className="p-4">
        <div className="text-[11px] text-muted-foreground uppercase">soulcinema.de</div>
        <div className="font-semibold text-sm line-clamp-1 mt-0.5">{title}</div>
        <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{description}</div>
      </div>
    </div>
  )
}

function SystemNotes({ values }: { values: Record<string, any> }) {
  if (!values.admin_setup_code) return null
  return (
    <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-muted-foreground">
      <strong className="text-yellow-500">Sicherheitshinweis:</strong> Der Admin-Setup-Code ist noch gesetzt. Sobald der erste Admin aktiv ist, sollte das Feld geleert werden, damit niemand sonst per Code Admin-Rechte beanspruchen kann.
    </div>
  )
}

function EmailNotes() {
  return (
    <div className="mb-6 bg-card clean-border rounded-xl p-4 text-sm text-muted-foreground space-y-2">
      <div><strong className="text-foreground">E-Mail-Versand über STRATO SMTP.</strong> Bei jeder neuen Kontaktanfrage wird automatisch eine interne Benachrichtigung an die Empfänger-E-Mail gesendet.</div>
      <div>SMTP-Zugangsdaten (Host, Port, Benutzer, Passwort) werden ausschließlich als sichere Edge-Function-Secrets gespeichert – niemals im Admin-Panel oder im Code.</div>
      <div className="text-[11px]">Standard: <code>smtp.strato.de</code> · Port <code>465</code> (SSL/TLS) · Fallback Port <code>587</code> (STARTTLS).</div>
    </div>
  )
}



function ListEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const inp = 'w-full px-3 py-2 rounded-md bg-background border border-border'
  return (
    <div className="space-y-2">
      {value.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={s} onChange={e => { const n = [...value]; n[i] = e.target.value; onChange(n) }} className={inp} />
          <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-red-500 px-2" aria-label="Eintrag entfernen">×</button>
        </div>
      ))}
      <button onClick={() => onChange([...value, ''])} className="text-sm text-muted-foreground hover:text-foreground">+ Eintrag hinzufügen</button>
    </div>
  )
}
