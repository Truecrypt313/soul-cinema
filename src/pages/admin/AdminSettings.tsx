'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

type Setting = { key: string; label: string; type?: 'text' | 'textarea' | 'list' | 'url'; hint?: string; group: string; rows?: number }

const FIELDS: Setting[] = [
  { key: 'hero_video_url', label: 'Hero Video URL', type: 'url', group: 'Hero', hint: 'Die URL des Videos im Hero. Wir empfehlen .mp4 oder .webm.' },
  { key: 'hero_badge', label: 'Hero Badge', group: 'Hero' },
  { key: 'hero_headline', label: 'Hero Headline', type: 'textarea', rows: 2, group: 'Hero' },
  { key: 'hero_subline', label: 'Hero Subline', type: 'textarea', rows: 3, group: 'Hero' },
  { key: 'hero_secondary_line', label: 'Hero zweite Zeile', type: 'textarea', rows: 2, group: 'Hero' },
  { key: 'hero_bullets', label: 'Hero Bullet Points', type: 'list', group: 'Hero' },
  { key: 'primary_cta_label', label: 'Primärer CTA', group: 'Hero' },
  { key: 'secondary_cta_label', label: 'Sekundärer CTA', group: 'Hero' },

  { key: 'contact_email', label: 'Kontakt-E-Mail', type: 'url', group: 'Kontakt' },
  { key: 'whatsapp_number', label: 'WhatsApp-Nummer', group: 'Kontakt', hint: 'Mit Ländervorwahl, z. B. 491701234567. Leer lassen, um zu verstecken.' },
  { key: 'calendly_url', label: 'Calendly-Link', type: 'url', group: 'Kontakt', hint: 'Leer lassen, um zu verstecken.' },

  { key: 'seo_title', label: 'SEO Title', group: 'SEO', hint: 'Wird in index.html beim nächsten Deploy verwendet.' },
  { key: 'seo_description', label: 'SEO Description', type: 'textarea', rows: 2, group: 'SEO' },
  { key: 'og_title', label: 'OG Title', group: 'SEO' },
  { key: 'og_description', label: 'OG Description', type: 'textarea', rows: 2, group: 'SEO' },
  { key: 'og_image_url', label: 'OG Image URL', type: 'url', group: 'SEO' },

  { key: 'footer_text', label: 'Footer Text', type: 'textarea', rows: 3, group: 'Footer' },

  { key: 'admin_setup_code', label: 'Admin-Setup-Code', group: 'Sicherheit', hint: 'Wird bei der erstmaligen Admin-Aktivierung abgefragt. Nach Aktivierung nicht weitergeben.' },
]

export default function AdminSettings() {
  const { toast } = useToast()
  const [values, setValues] = useState<Record<string, any>>({})
  const [dirty, setDirty] = useState<Record<string, boolean>>({})
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

  const save = async (key: string) => {
    const { error } = await supabase.from('site_settings').upsert({ key, value: values[key] ?? '' })
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    toast({ title: 'Gespeichert', description: key })
    setDirty(prev => ({ ...prev, [key]: false }))
  }

  const groups = Array.from(new Set(FIELDS.map(f => f.group)))
  const inp = 'w-full px-3 py-2 rounded-md bg-background border border-border focus:outline-none focus:border-[#C9963B]/60'

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Einstellungen</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
        Texte, Kontaktdaten und SEO-Felder. Änderungen sind sofort live (außer SEO-Tags in <code>index.html</code>, die erst beim nächsten Deploy aktualisiert werden).
      </p>

      <div className="space-y-8">
        {groups.map(g => (
          <section key={g}>
            <h2 className="text-lg font-bold mb-3 text-[#C9963B]">{g}</h2>
            <div className="space-y-4 bg-card clean-border rounded-xl p-5">
              {FIELDS.filter(f => f.group === g).map(f => {
                const v = values[f.key]
                return (
                  <div key={f.key}>
                    <div className="flex items-end justify-between mb-1">
                      <label className="block text-xs uppercase text-muted-foreground">{f.label}</label>
                      <code className="text-[10px] text-muted-foreground/60">{f.key}</code>
                    </div>
                    {f.type === 'list' ? (
                      <ListEditor value={Array.isArray(v) ? v : []} onChange={(arr) => setVal(f.key, arr)} />
                    ) : f.type === 'textarea' ? (
                      <textarea rows={f.rows ?? 2} value={typeof v === 'string' ? v : ''} onChange={e => setVal(f.key, e.target.value)} className={inp} />
                    ) : (
                      <input value={typeof v === 'string' ? v : ''} onChange={e => setVal(f.key, e.target.value)} className={inp} />
                    )}
                    {f.hint && <p className="text-[11px] text-muted-foreground mt-1">{f.hint}</p>}
                    {dirty[f.key] && (
                      <button onClick={() => save(f.key)} className="mt-2 px-3 py-1.5 rounded-md bg-foreground text-background text-sm font-semibold">Speichern</button>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12">
        <button onClick={() => setAdvanced(a => !a)} className="text-sm text-muted-foreground hover:text-foreground">
          {advanced ? '▼ Erweitert (JSON-Editor)' : '▶ Erweitert (JSON-Editor)'}
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

function ListEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const inp = 'w-full px-3 py-2 rounded-md bg-background border border-border'
  return (
    <div className="space-y-2">
      {value.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={s} onChange={e => { const n = [...value]; n[i] = e.target.value; onChange(n) }} className={inp} />
          <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-red-500 px-2">×</button>
        </div>
      ))}
      <button onClick={() => onChange([...value, ''])} className="text-sm text-muted-foreground hover:text-foreground">+ Eintrag hinzufügen</button>
    </div>
  )
}
