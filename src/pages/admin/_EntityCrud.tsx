'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Icon } from '@/lib/icon'
import { Trash2, Plus, GripVertical, Eye, EyeOff } from 'lucide-react'

export type FieldDef = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'icon' | 'number' | 'checkbox'
  placeholder?: string
  rows?: number
  hint?: string
}

type Row = Record<string, any> & { id: string; sort_order: number; visible: boolean }

export function EntityCrud({
  table, title, intro, fields, defaults, previewLabel,
}: {
  table: string
  title: string
  intro?: string
  fields: FieldDef[]
  defaults: Record<string, any>
  previewLabel?: (row: Row) => string
}) {
  const { toast } = useToast()
  const [rows, setRows] = useState<Row[]>([])
  const [editing, setEditing] = useState<Row | (Record<string, any> & { id?: string }) | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await (supabase as any).from(table).select('*').order('sort_order', { ascending: true })
    if (error) toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    setRows((data as Row[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() /* eslint-disable-line */ }, [table])

  const save = async () => {
    if (!editing) return
    const payload: Record<string, any> = {}
    for (const f of fields) {
      const v = editing[f.key]
      if (f.type === 'number') payload[f.key] = v === '' || v == null ? 0 : Number(v)
      else if (f.type === 'checkbox') payload[f.key] = !!v
      else payload[f.key] = v === '' ? null : v
    }
    payload.sort_order = Number(editing.sort_order) || 0
    payload.visible = editing.visible !== false
    let error
    if ((editing as any).id) {
      ({ error } = await (supabase as any).from(table).update(payload).eq('id', (editing as any).id))
    } else {
      ({ error } = await (supabase as any).from(table).insert(payload))
    }
    if (error) return toast({ title: 'Speichern fehlgeschlagen', description: error.message, variant: 'destructive' })
    toast({ title: 'Gespeichert' })
    setEditing(null)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Eintrag löschen?')) return
    const { error } = await (supabase as any).from(table).delete().eq('id', id)
    if (error) return toast({ title: 'Löschen fehlgeschlagen', description: error.message, variant: 'destructive' })
    load()
  }

  const toggleVisible = async (r: Row) => {
    const { error } = await (supabase as any).from(table).update({ visible: !r.visible }).eq('id', r.id)
    if (error) return toast({ title: 'Fehler', variant: 'destructive' })
    load()
  }

  const move = async (r: Row, dir: -1 | 1) => {
    const newOrder = r.sort_order + dir * 10
    await (supabase as any).from(table).update({ sort_order: newOrder }).eq('id', r.id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black">{title}</h1>
          {intro && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{intro}</p>}
        </div>
        <button onClick={() => setEditing({ ...defaults, sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 10, visible: true })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background font-semibold">
          <Plus className="w-4 h-4" /> Neu
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Lade…</div> : (
        <div className="space-y-2">
          {rows.map(r => (
            <div key={r.id} className="bg-card clean-border rounded-lg p-4 flex items-center gap-3">
              <div className="flex flex-col">
                <button onClick={() => move(r, -1)} className="text-muted-foreground hover:text-foreground text-xs">▲</button>
                <button onClick={() => move(r, 1)} className="text-muted-foreground hover:text-foreground text-xs">▼</button>
              </div>
              {(r as any).icon_name && (
                <div className="w-9 h-9 rounded bg-accent-soft flex items-center justify-center">
                  <Icon name={(r as any).icon_name} className="w-4 h-4 text-[#C9963B]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{previewLabel ? previewLabel(r) : (r as any).title || (r as any).name || (r as any).question}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {(r as any).tagline || (r as any).description || (r as any).answer || (r as any).price_label || ''}
                </div>
              </div>
              <button onClick={() => toggleVisible(r)} className="p-2 text-muted-foreground hover:text-foreground" title={r.visible ? 'Sichtbar' : 'Versteckt'}>
                {r.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-50" />}
              </button>
              <button onClick={() => setEditing(r)} className="px-3 py-1.5 rounded border border-border text-sm hover:bg-foreground/5">Bearbeiten</button>
              <button onClick={() => remove(r.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {rows.length === 0 && <div className="text-muted-foreground text-sm">Noch keine Einträge.</div>}
        </div>
      )}

      {editing && (
        <Modal onClose={() => setEditing(null)} title={(editing as any).id ? 'Bearbeiten' : 'Neu'}>
          <div className="space-y-3">
            {fields.map(f => (
              <FieldRow key={f.key} field={f} value={editing[f.key] ?? ''} onChange={v => setEditing({ ...editing, [f.key]: v })} />
            ))}
            <div className="grid grid-cols-2 gap-3">
              <FieldRow field={{ key: 'sort_order', label: 'Sortierung', type: 'number' }}
                value={editing.sort_order ?? 0} onChange={v => setEditing({ ...editing, sort_order: v })} />
              <label className="flex items-end gap-2 pb-2">
                <input type="checkbox" checked={editing.visible !== false} onChange={e => setEditing({ ...editing, visible: e.target.checked })} />
                <span className="text-sm">Sichtbar</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-md border border-border">Abbrechen</button>
            <button onClick={save} className="px-4 py-2 rounded-md bg-foreground text-background font-semibold">Speichern</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-card clean-border rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-black mb-4">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export const inp = 'w-full px-3 py-2 rounded-md bg-background border border-border focus:outline-none focus:border-[#C9963B]/60'

export function FieldRow({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  return (
    <div>
      <label className="block text-xs uppercase text-muted-foreground mb-1">{field.label}</label>
      {field.type === 'textarea' ? (
        <textarea rows={field.rows ?? 3} value={value ?? ''} placeholder={field.placeholder} onChange={e => onChange(e.target.value)} className={inp} />
      ) : field.type === 'number' ? (
        <input type="number" value={value ?? 0} onChange={e => onChange(Number(e.target.value))} className={inp} />
      ) : field.type === 'checkbox' ? (
        <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
      ) : field.type === 'icon' ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-accent-soft flex items-center justify-center">
              <Icon name={value} className="w-4 h-4 text-[#C9963B]" />
            </div>
            <input value={value ?? ''} placeholder="z. B. Film, Megaphone, Sparkles, Zap" onChange={e => onChange(e.target.value)} className={inp} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Lucide-Icon-Name — siehe lucide.dev/icons</p>
        </>
      ) : (
        <input value={value ?? ''} placeholder={field.placeholder} onChange={e => onChange(e.target.value)} className={inp} />
      )}
      {field.hint && <p className="text-[11px] text-muted-foreground mt-1">{field.hint}</p>}
    </div>
  )
}
