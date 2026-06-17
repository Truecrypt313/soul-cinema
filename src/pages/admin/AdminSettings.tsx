'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

type Setting = { key: string; value: any }

export default function AdminSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Setting[]>([])
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('{}')

  const load = async () => {
    const { data, error } = await supabase.from('site_settings').select('*').order('key')
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    setSettings((data as Setting[]) ?? [])
  }
  useEffect(() => { load() }, [])

  const save = async (key: string, value: any) => {
    const { error } = await supabase.from('site_settings').upsert({ key, value })
    if (error) return toast({ title: 'Speichern fehlgeschlagen', description: error.message, variant: 'destructive' })
    toast({ title: 'Gespeichert' })
    load()
  }

  const remove = async (key: string) => {
    if (!confirm(`Eintrag "${key}" löschen?`)) return
    const { error } = await supabase.from('site_settings').delete().eq('key', key)
    if (error) return toast({ title: 'Löschen fehlgeschlagen', description: error.message, variant: 'destructive' })
    load()
  }

  const addNew = async () => {
    let parsed: any
    try { parsed = JSON.parse(newValue) } catch { return toast({ title: 'Wert ist kein gültiges JSON', variant: 'destructive' }) }
    if (!newKey.trim()) return toast({ title: 'Bitte Schlüssel angeben', variant: 'destructive' })
    await save(newKey.trim(), parsed)
    setNewKey(''); setNewValue('{}')
  }

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Inhalte</h1>
      <p className="text-muted-foreground mb-6 text-sm max-w-2xl">
        Editierbare Website-Texte als JSON-Schlüssel/Wert-Paare. Die Website nutzt Fallback-Werte, falls hier nichts gepflegt ist.
        Empfohlene Schlüssel: <code>brand</code>, <code>seo</code>, <code>hero</code>, <code>process</code>, <code>services</code>, <code>audience</code>, <code>contact</code>, <code>footer</code>, <code>social</code>.
      </p>

      <div className="bg-card clean-border rounded-xl p-5 mb-8">
        <h2 className="font-bold mb-3">Neuer Eintrag</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-3">
          <input placeholder="Schlüssel" value={newKey} onChange={e => setNewKey(e.target.value)} className="px-3 py-2 rounded-md bg-background border border-border" />
          <textarea placeholder='{"foo":"bar"}' value={newValue} onChange={e => setNewValue(e.target.value)} rows={3} className="px-3 py-2 rounded-md bg-background border border-border font-mono text-sm" />
          <button onClick={addNew} className="px-4 py-2 rounded-md bg-foreground text-background font-semibold self-start">Hinzufügen</button>
        </div>
      </div>

      <div className="space-y-4">
        {settings.map(s => <SettingRow key={s.key} setting={s} onSave={save} onDelete={remove} />)}
        {settings.length === 0 && <div className="text-muted-foreground">Noch keine Einträge.</div>}
      </div>
    </div>
  )
}

function SettingRow({ setting, onSave, onDelete }: { setting: Setting; onSave: (k: string, v: any) => void; onDelete: (k: string) => void }) {
  const [val, setVal] = useState(JSON.stringify(setting.value, null, 2))
  const [err, setErr] = useState<string | null>(null)
  return (
    <div className="bg-card clean-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <code className="font-bold">{setting.key}</code>
        <button onClick={() => onDelete(setting.key)} className="text-sm text-red-500 hover:underline">Löschen</button>
      </div>
      <textarea
        value={val}
        onChange={e => { setVal(e.target.value); setErr(null) }}
        rows={Math.min(12, val.split('\n').length + 1)}
        className="w-full px-3 py-2 rounded-md bg-background border border-border font-mono text-sm"
      />
      {err && <div className="text-xs text-red-500 mt-1">{err}</div>}
      <div className="mt-2">
        <button
          onClick={() => {
            try {
              const parsed = JSON.parse(val)
              onSave(setting.key, parsed)
            } catch (e: any) {
              setErr('Ungültiges JSON: ' + e.message)
            }
          }}
          className="px-3 py-1.5 rounded-md bg-foreground text-background text-sm font-semibold"
        >
          Speichern
        </button>
      </div>
    </div>
  )
}
