'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Modal, inp, FieldRow } from './_EntityCrud'
import { Trash2, Plus, Upload } from 'lucide-react'

type Item = {
  id: string; title: string; category: string | null; description: string | null
  video_url: string | null; thumbnail_url: string | null; format_badge: string | null
  published: boolean; sort_order: number
}
const empty = { title: '', category: '', description: '', video_url: '', thumbnail_url: '', format_badge: '9:16', published: false, sort_order: 10 }

// Signed-URL cache for previews (private bucket)
async function signedFor(path: string | null): Promise<string | null> {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  const { data } = await supabase.storage.from('portfolio-media').createSignedUrl(path, 60 * 60 * 24 * 365)
  return data?.signedUrl ?? null
}

export default function AdminPortfolio() {
  const { toast } = useToast()
  const [items, setItems] = useState<Item[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [uploading, setUploading] = useState<'thumb' | 'video' | null>(null)
  const [previews, setPreviews] = useState<Record<string, string>>({})

  const load = async () => {
    const { data, error } = await supabase.from('portfolio_items').select('*').order('sort_order', { ascending: true })
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    const list = (data as Item[]) ?? []
    setItems(list)
    const p: Record<string, string> = {}
    for (const it of list) {
      const u = await signedFor(it.thumbnail_url)
      if (u) p[it.id] = u
    }
    setPreviews(p)
  }
  useEffect(() => { load() }, [])

  const uploadFile = async (file: File, kind: 'thumb' | 'video') => {
    setUploading(kind)
    const ext = file.name.split('.').pop() || 'bin'
    const path = `${kind}s/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('portfolio-media').upload(path, file, { upsert: false, contentType: file.type })
    setUploading(null)
    if (error) { toast({ title: 'Upload fehlgeschlagen', description: error.message, variant: 'destructive' }); return null }
    return path // store path; preview via signed URL
  }

  const save = async () => {
    const payload = {
      title: editing.title, category: editing.category || null, description: editing.description || null,
      video_url: editing.video_url || null, thumbnail_url: editing.thumbnail_url || null,
      format_badge: editing.format_badge || null, published: !!editing.published,
      sort_order: Number(editing.sort_order) || 0,
    }
    const { error } = editing.id
      ? await supabase.from('portfolio_items').update(payload).eq('id', editing.id)
      : await supabase.from('portfolio_items').insert(payload)
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    toast({ title: 'Gespeichert' }); setEditing(null); load()
  }
  const remove = async (id: string) => { if (!confirm('Löschen?')) return; await supabase.from('portfolio_items').delete().eq('id', id); load() }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-1">URL oder Datei-Upload (privater Bucket, signierte URLs).</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background font-semibold">
          <Plus className="w-4 h-4" /> Neu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(it => (
          <div key={it.id} className="bg-card clean-border rounded-xl overflow-hidden">
            <div className="aspect-video bg-background flex items-center justify-center">
              {previews[it.id]
                ? <img src={previews[it.id]} alt={it.title} className="w-full h-full object-cover" />
                : <span className="text-xs text-muted-foreground">Kein Thumbnail</span>}
            </div>
            <div className="p-4">
              <div className="font-bold">{it.title}</div>
              <div className="text-xs text-muted-foreground">{it.category} · Sort {it.sort_order}</div>
              <div className="text-xs mt-2 mb-3">
                <span className={`px-2 py-0.5 rounded ${it.published ? 'bg-green-500/15 text-green-500' : 'bg-yellow-500/15 text-yellow-500'}`}>
                  {it.published ? 'Veröffentlicht' : 'Entwurf'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(it)} className="px-3 py-1 rounded border border-border text-sm">Bearbeiten</button>
                <button onClick={() => remove(it.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-muted-foreground">Noch keine Einträge.</div>}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? 'Bearbeiten' : 'Neu'}>
          <div className="space-y-3 text-sm">
            <FieldRow field={{ key: 'title', label: 'Titel' }} value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
            <FieldRow field={{ key: 'category', label: 'Kategorie' }} value={editing.category} onChange={v => setEditing({ ...editing, category: v })} />
            <FieldRow field={{ key: 'description', label: 'Beschreibung', type: 'textarea' }} value={editing.description} onChange={v => setEditing({ ...editing, description: v })} />
            <FieldRow field={{ key: 'format_badge', label: 'Format Badge', placeholder: '9:16 / 1:1 / 16:9' }} value={editing.format_badge} onChange={v => setEditing({ ...editing, format_badge: v })} />

            <div>
              <label className="block text-xs uppercase text-muted-foreground mb-1">Thumbnail</label>
              <div className="flex items-center gap-2">
                <input value={editing.thumbnail_url ?? ''} onChange={e => setEditing({ ...editing, thumbnail_url: e.target.value })} className={inp} placeholder="URL oder Storage-Pfad" />
                <label className="px-3 py-2 rounded-md border border-border cursor-pointer hover:bg-foreground/5 inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5" /> {uploading === 'thumb' ? '…' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                    const f = e.target.files?.[0]; if (!f) return
                    const path = await uploadFile(f, 'thumb')
                    if (path) setEditing({ ...editing, thumbnail_url: path })
                  }} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase text-muted-foreground mb-1">Video</label>
              <div className="flex items-center gap-2">
                <input value={editing.video_url ?? ''} onChange={e => setEditing({ ...editing, video_url: e.target.value })} className={inp} placeholder="URL oder Storage-Pfad" />
                <label className="px-3 py-2 rounded-md border border-border cursor-pointer hover:bg-foreground/5 inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5" /> {uploading === 'video' ? '…' : 'Upload'}
                  <input type="file" accept="video/*" className="hidden" onChange={async e => {
                    const f = e.target.files?.[0]; if (!f) return
                    const path = await uploadFile(f, 'video')
                    if (path) setEditing({ ...editing, video_url: path })
                  }} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FieldRow field={{ key: 'sort_order', label: 'Sortierung', type: 'number' }} value={editing.sort_order} onChange={v => setEditing({ ...editing, sort_order: v })} />
              <label className="flex items-end gap-2 pb-2">
                <input type="checkbox" checked={!!editing.published} onChange={e => setEditing({ ...editing, published: e.target.checked })} />
                <span>Veröffentlicht</span>
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
