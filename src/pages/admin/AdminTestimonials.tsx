'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Modal, inp, FieldRow } from './_EntityCrud'
import { Trash2, Plus, Eye, EyeOff, Star } from 'lucide-react'

type T = { id: string; name: string; company: string | null; avatar_url: string | null; quote: string; rating: number; visible: boolean; sort_order: number }
const empty = { name: '', company: '', avatar_url: '', quote: '', rating: 5, visible: false, sort_order: 10 }

export default function AdminTestimonials() {
  const { toast } = useToast()
  const [rows, setRows] = useState<T[]>([])
  const [editing, setEditing] = useState<any>(null)

  const load = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
    setRows((data as T[]) ?? [])
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    const payload = {
      name: editing.name, company: editing.company || null, avatar_url: editing.avatar_url || null,
      quote: editing.quote, rating: Number(editing.rating) || 5,
      visible: !!editing.visible, sort_order: Number(editing.sort_order) || 0,
    }
    const { error } = editing.id
      ? await supabase.from('testimonials').update(payload).eq('id', editing.id)
      : await supabase.from('testimonials').insert(payload)
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    toast({ title: 'Gespeichert' }); setEditing(null); load()
  }
  const remove = async (id: string) => { if (!confirm('Löschen?')) return; await supabase.from('testimonials').delete().eq('id', id); load() }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">Nur „Auf Website anzeigen“-Einträge erscheinen live. 0 sichtbar = Sektion ausgeblendet, 1 = einzelne Quote, 2+ = Grid.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background font-semibold">
          <Plus className="w-4 h-4" /> Neu
        </button>
      </div>

      <div className="mb-4 bg-yellow-500/10 border border-yellow-500/25 rounded-lg p-3 text-xs text-muted-foreground">
        <strong className="text-yellow-500">Hinweis:</strong> Bitte nur echte Kundenstimmen veröffentlichen. Keine Platzhalter oder erfundenen Bewertungen.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map(t => (
          <div key={t.id} className="bg-card clean-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {t.avatar_url && <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />}
                <div>
                  <div className="font-bold">{t.name}</div>
                  {t.company && <div className="text-xs text-muted-foreground">{t.company}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-[#C9963B] fill-[#C9963B]" />)}</div>
                {t.visible
                  ? <span className="text-[10px] text-green-500 inline-flex items-center gap-1"><Eye className="w-3 h-3" />live</span>
                  : <span className="text-[10px] text-muted-foreground/60 inline-flex items-center gap-1"><EyeOff className="w-3 h-3" />verborgen</span>}
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic mb-3">„{t.quote}"</p>
            <div className="flex gap-2">
              <button onClick={() => setEditing(t)} className="px-3 py-1 rounded border border-border text-sm">Bearbeiten</button>
              <button onClick={() => remove(t.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="md:col-span-2 bg-card clean-border rounded-xl p-8 text-center">
            <div className="font-semibold mb-1">Noch keine echten Kundenstimmen veröffentlicht</div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">Die Testimonials-Sektion bleibt auf der Website ausgeblendet, bis mindestens ein sichtbares Testimonial vorhanden ist.</p>
            <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#C9963B] text-[#0A0A0A] font-semibold">
              <Plus className="w-4 h-4" /> Erstes Testimonial anlegen
            </button>
          </div>
        )}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? 'Bearbeiten' : 'Neu'}>
          <div className="space-y-3">
            <FieldRow field={{ key: 'name', label: 'Name' }} value={editing.name} onChange={v => setEditing({ ...editing, name: v })} />
            <FieldRow field={{ key: 'company', label: 'Unternehmen' }} value={editing.company} onChange={v => setEditing({ ...editing, company: v })} />
            <FieldRow field={{ key: 'avatar_url', label: 'Avatar URL', hint: 'Optional. Quadratisches Bild empfohlen.' }} value={editing.avatar_url} onChange={v => setEditing({ ...editing, avatar_url: v })} />
            <FieldRow field={{ key: 'quote', label: 'Zitat', type: 'textarea', rows: 4 }} value={editing.quote} onChange={v => setEditing({ ...editing, quote: v })} />
            <div>
              <label className="block text-xs uppercase text-muted-foreground mb-1">Bewertung (1–5)</label>
              <input type="number" min={1} max={5} value={editing.rating} onChange={e => setEditing({ ...editing, rating: Number(e.target.value) })} className={inp} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-end gap-2 pb-2">
                <input type="checkbox" checked={!!editing.visible} onChange={e => setEditing({ ...editing, visible: e.target.checked })} />
                <span className="text-sm">Auf Website anzeigen</span>
              </label>
              <FieldRow field={{ key: 'sort_order', label: 'Reihenfolge', type: 'number' }} value={editing.sort_order} onChange={v => setEditing({ ...editing, sort_order: v })} />
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
