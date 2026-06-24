'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Modal, inp, FieldRow } from './_EntityCrud'
import { Trash2, Plus, Eye, EyeOff, Upload } from 'lucide-react'
import { resolvePortfolioMediaUrl, resolveMany } from '@/lib/portfolioMedia'

type Style = {
  id: string
  label: string
  image_url: string | null
  visible: boolean
  sort_order: number
}

const empty = { label: '', image_url: '', visible: true, sort_order: 10 }

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE = 5 * 1024 * 1024

export default function AdminCreativeStyles() {
  const { toast } = useToast()
  const [rows, setRows] = useState<Style[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [previews, setPreviews] = useState<Record<string, string | null>>({})
  const [editingPreview, setEditingPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    const { data, error } = await supabase
      .from('creative_styles')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    const list = (data as Style[]) ?? []
    setRows(list)
    const map = await resolveMany(list.map(r => r.image_url))
    const byId: Record<string, string | null> = {}
    for (const r of list) byId[r.id] = r.image_url ? map[r.image_url] ?? null : null
    setPreviews(byId)
  }
  useEffect(() => { load() }, [])

  useEffect(() => {
    let active = true
    setEditingPreview(null)
    if (!editing?.image_url) return
    resolvePortfolioMediaUrl(editing.image_url).then(u => { if (active) setEditingPreview(u) })
    return () => { active = false }
  }, [editing?.image_url])

  const uploadFile = async (file: File) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      toast({ title: 'Falscher Dateityp', description: 'Erlaubt: JPG, PNG, WebP', variant: 'destructive' })
      return
    }
    if (file.size > MAX_IMAGE) {
      toast({ title: 'Datei zu groß', description: 'Max. 5 MB', variant: 'destructive' })
      return
    }
    setUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `creative-styles/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('portfolio-media').upload(path, file, { upsert: false, contentType: file.type })
    setUploading(false)
    if (error) return toast({ title: 'Upload fehlgeschlagen', description: error.message, variant: 'destructive' })
    setEditing({ ...editing, image_url: path })
    toast({ title: 'Bild hochgeladen' })
  }

  const save = async () => {
    const payload = {
      label: editing.label?.trim(),
      image_url: editing.image_url || null,
      visible: !!editing.visible,
      sort_order: Number(editing.sort_order) || 0,
    }
    if (!payload.label) return toast({ title: 'Label fehlt', variant: 'destructive' })
    const { error } = editing.id
      ? await supabase.from('creative_styles').update(payload).eq('id', editing.id)
      : await supabase.from('creative_styles').insert(payload)
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    toast({ title: 'Gespeichert' })
    setEditing(null)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Eintrag löschen?')) return
    const { error } = await supabase.from('creative_styles').delete().eq('id', id)
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    load()
  }

  const toggleVisible = async (r: Style) => {
    await supabase.from('creative_styles').update({ visible: !r.visible }).eq('id', r.id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black">Creative Styles</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Persona-Kacheln in der „Gemacht für"-Sektion. Reihenfolge bestimmt die Anzeige; das mittlere Tile wird automatisch hervorgehoben.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...empty, sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 10 })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background font-semibold"
        >
          <Plus className="w-4 h-4" /> Neu
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {rows.map(r => (
          <div key={r.id} className="bg-card clean-border rounded-xl p-3">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 flex items-center justify-center">
              {previews[r.id] ? (
                <img src={previews[r.id]!} alt={r.label} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">Kein Bild</span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="font-semibold text-sm truncate">{r.label}</div>
              {r.visible
                ? <span className="text-[10px] text-green-500 inline-flex items-center gap-1"><Eye className="w-3 h-3" />live</span>
                : <span className="text-[10px] text-muted-foreground/60 inline-flex items-center gap-1"><EyeOff className="w-3 h-3" />aus</span>}
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setEditing(r)} className="flex-1 px-2 py-1 rounded border border-border text-xs hover:bg-foreground/5">Bearbeiten</button>
              <button onClick={() => toggleVisible(r)} className="p-1.5 border border-border rounded text-muted-foreground hover:text-foreground" title={r.visible ? 'Verbergen' : 'Anzeigen'}>
                {r.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => remove(r.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="col-span-full bg-card clean-border rounded-xl p-8 text-center">
            <div className="font-semibold mb-1">Noch keine Creative Styles</div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">Bis ein Eintrag sichtbar ist, zeigt die Website die Standard-Kacheln.</p>
            <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#C9963B] text-[#0A0A0A] font-semibold">
              <Plus className="w-4 h-4" /> Erste Persona anlegen
            </button>
          </div>
        )}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? 'Bearbeiten' : 'Neu'}>
          <div className="space-y-3">
            <FieldRow field={{ key: 'label', label: 'Label', placeholder: 'z. B. UGC Hook' }} value={editing.label} onChange={v => setEditing({ ...editing, label: v })} />

            <div>
              <label className="block text-xs uppercase text-muted-foreground mb-1">Bild</label>
              <div className="flex items-start gap-3">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                  {editingPreview
                    ? <img src={editingPreview} alt="" className="w-full h-full object-cover" />
                    : <span className="text-[10px] text-muted-foreground">leer</span>}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border cursor-pointer hover:bg-foreground/5 text-sm">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Lade hoch…' : 'Bild hochladen'}
                    <input
                      type="file"
                      accept={IMAGE_TYPES.join(',')}
                      className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f) }}
                    />
                  </label>
                  <input
                    value={editing.image_url ?? ''}
                    placeholder="oder Storage-Pfad / URL eingeben"
                    onChange={e => setEditing({ ...editing, image_url: e.target.value })}
                    className={inp}
                  />
                  <p className="text-[11px] text-muted-foreground">JPG, PNG oder WebP. Quadratisch empfohlen, max. 5 MB.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FieldRow field={{ key: 'sort_order', label: 'Reihenfolge', type: 'number', hint: 'Kleinere Zahl = weiter links.' }}
                value={editing.sort_order} onChange={v => setEditing({ ...editing, sort_order: v })} />
              <label className="flex items-end gap-2 pb-2">
                <input type="checkbox" checked={!!editing.visible} onChange={e => setEditing({ ...editing, visible: e.target.checked })} />
                <span className="text-sm">Auf Website anzeigen</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-md border border-border">Abbrechen</button>
            <button onClick={save} disabled={uploading} className="px-4 py-2 rounded-md bg-foreground text-background font-semibold disabled:opacity-60">Speichern</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
