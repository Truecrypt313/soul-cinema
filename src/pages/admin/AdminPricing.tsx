'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Modal, inp, FieldRow } from './_EntityCrud'
import { Trash2, Plus, Eye, EyeOff, X } from 'lucide-react'

type Pkg = { id: string; name: string; price_label: string; description: string | null; features: string[]; cta_label: string | null; highlighted: boolean; sort_order: number; visible: boolean }

const empty = { name: '', price_label: '', description: '', features: [] as string[], cta_label: 'Projekt anfragen', highlighted: false, sort_order: 10, visible: true }

export default function AdminPricing() {
  const { toast } = useToast()
  const [rows, setRows] = useState<Pkg[]>([])
  const [editing, setEditing] = useState<any>(null)

  const load = async () => {
    const { data } = await supabase.from('pricing_packages').select('*').order('sort_order', { ascending: true })
    setRows((data as Pkg[]) ?? [])
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    const payload = {
      name: editing.name, price_label: editing.price_label,
      description: editing.description || null, features: editing.features || [],
      cta_label: editing.cta_label || null, highlighted: !!editing.highlighted,
      sort_order: Number(editing.sort_order) || 0, visible: editing.visible !== false,
    }
    const { error } = editing.id
      ? await supabase.from('pricing_packages').update(payload).eq('id', editing.id)
      : await supabase.from('pricing_packages').insert(payload)
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    toast({ title: 'Gespeichert' }); setEditing(null); load()
  }

  const remove = async (id: string) => {
    if (!confirm('Paket löschen?')) return
    await supabase.from('pricing_packages').delete().eq('id', id); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black">Preise</h1>
          <p className="text-sm text-muted-foreground mt-1">Pakete mit Features als Liste.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background font-semibold">
          <Plus className="w-4 h-4" /> Neu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map(p => (
          <div key={p.id} className={`bg-card clean-border rounded-xl p-5 ${p.highlighted ? 'border-[#C9963B]/40' : ''}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-[#C9963B] text-lg font-black">{p.price_label}</div>
              </div>
              <div className="flex items-center gap-1">
                {p.visible ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground/50" />}
                {p.highlighted && <span className="text-[10px] bg-[#C9963B] text-[#0A0A0A] px-2 py-0.5 rounded">Beliebt</span>}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
            <ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
              {(p.features ?? []).map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <div className="flex gap-2">
              <button onClick={() => setEditing({ ...p, features: p.features ?? [] })} className="px-3 py-1 rounded border border-border text-sm">Bearbeiten</button>
              <button onClick={() => remove(p.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 bg-card clean-border rounded-xl p-8 text-center">
            <div className="font-semibold mb-1">Noch keine Pakete angelegt</div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">Klare Preispakete helfen Interessenten, schneller eine Entscheidung zu treffen.</p>
            <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#C9963B] text-[#0A0A0A] font-semibold">
              <Plus className="w-4 h-4" /> Erstes Paket anlegen
            </button>
          </div>
        )}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? 'Paket bearbeiten' : 'Neues Paket'}>
          <div className="space-y-3">
            <FieldRow field={{ key: 'name', label: 'Name' }} value={editing.name} onChange={v => setEditing({ ...editing, name: v })} />
            <FieldRow field={{ key: 'price_label', label: 'Preislabel', placeholder: 'z. B. ab 790 €' }} value={editing.price_label} onChange={v => setEditing({ ...editing, price_label: v })} />
            <FieldRow field={{ key: 'description', label: 'Beschreibung', type: 'textarea' }} value={editing.description} onChange={v => setEditing({ ...editing, description: v })} />
            <FieldRow field={{ key: 'cta_label', label: 'CTA-Label' }} value={editing.cta_label} onChange={v => setEditing({ ...editing, cta_label: v })} />

            <div>
              <label className="block text-xs uppercase text-muted-foreground mb-1">Features</label>
              <div className="space-y-2">
                {(editing.features || []).map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={f} onChange={e => {
                      const next = [...editing.features]; next[i] = e.target.value
                      setEditing({ ...editing, features: next })
                    }} className={inp} />
                    <button onClick={() => setEditing({ ...editing, features: editing.features.filter((_: any, j: number) => j !== i) })}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded"><X className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => setEditing({ ...editing, features: [...(editing.features || []), ''] })}
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Feature hinzufügen
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-end gap-2 pb-2">
                <input type="checkbox" checked={!!editing.highlighted} onChange={e => setEditing({ ...editing, highlighted: e.target.checked })} />
                <span className="text-sm">Hervorgehoben</span>
              </label>
              <label className="flex items-end gap-2 pb-2">
                <input type="checkbox" checked={editing.visible !== false} onChange={e => setEditing({ ...editing, visible: e.target.checked })} />
                <span className="text-sm">Sichtbar</span>
              </label>
              <FieldRow field={{ key: 'sort_order', label: 'Sortierung', type: 'number' }} value={editing.sort_order} onChange={v => setEditing({ ...editing, sort_order: v })} />
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
