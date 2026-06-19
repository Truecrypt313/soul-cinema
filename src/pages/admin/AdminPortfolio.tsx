'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Modal, inp, FieldRow } from './_EntityCrud'
import { Trash2, Plus, Upload } from 'lucide-react'
import { resolvePortfolioMediaUrl, resolveMany } from '@/lib/portfolioMedia'

type Item = {
  id: string; title: string; category: string | null; description: string | null
  video_url: string | null; thumbnail_url: string | null; format_badge: string | null
  platform: string | null; project_goal: string | null; featured: boolean
  published: boolean; sort_order: number
}
const empty = { title: '', category: '', description: '', video_url: '', thumbnail_url: '', format_badge: '9:16', platform: '', project_goal: '', featured: false, published: false, sort_order: 10 }

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/webm']
const MAX_IMAGE = 5 * 1024 * 1024
const MAX_VIDEO = 80 * 1024 * 1024

function useResolvedUrl(value: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    setUrl(null)
    if (!value) return
    resolvePortfolioMediaUrl(value).then(u => { if (active) setUrl(u) })
    return () => { active = false }
  }, [value])
  return url
}

export default function AdminPortfolio() {
  const { toast } = useToast()
  const [items, setItems] = useState<Item[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [uploading, setUploading] = useState<'thumb' | 'video' | null>(null)
  const [previews, setPreviews] = useState<Record<string, string | null>>({})

  const load = async () => {
    const { data, error } = await supabase.from('portfolio_items').select('*').order('sort_order', { ascending: true })
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    const list = (data as Item[]) ?? []
    setItems(list)
    const map = await resolveMany(list.map(i => i.thumbnail_url))
    const byId: Record<string, string | null> = {}
    for (const it of list) byId[it.id] = it.thumbnail_url ? map[it.thumbnail_url] ?? null : null
    setPreviews(byId)
  }
  useEffect(() => { load() }, [])

  const uploadFile = async (file: File, kind: 'thumb' | 'video') => {
    const allowed = kind === 'thumb' ? IMAGE_TYPES : VIDEO_TYPES
    const max = kind === 'thumb' ? MAX_IMAGE : MAX_VIDEO
    if (!allowed.includes(file.type)) {
      toast({ title: 'Falscher Dateityp', description: `Erlaubt: ${allowed.join(', ')}`, variant: 'destructive' })
      return null
    }
    if (file.size > max) {
      toast({ title: 'Datei zu groß', description: `Maximal ${Math.round(max / 1024 / 1024)} MB.`, variant: 'destructive' })
      return null
    }
    setUploading(kind)
    const ext = file.name.split('.').pop() || 'bin'
    const path = `${kind}s/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('portfolio-media').upload(path, file, { upsert: false, contentType: file.type })
    setUploading(null)
    if (error) { toast({ title: 'Upload fehlgeschlagen', description: error.message, variant: 'destructive' }); return null }
    return path
  }

  const save = async () => {
    const payload = {
      title: editing.title, category: editing.category || null, description: editing.description || null,
      video_url: editing.video_url || null, thumbnail_url: editing.thumbnail_url || null,
      format_badge: editing.format_badge || null,
      platform: editing.platform || null, project_goal: editing.project_goal || null,
      featured: !!editing.featured,
      published: !!editing.published,
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
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black">Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">URL oder Datei-Upload. Storage-Pfade (z. B. <code>videos/…</code>), externe HTTPS-URLs und relative Pfade wie <code>/media/…</code> werden auf der Website automatisch korrekt aufgelöst.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background font-semibold">
          <Plus className="w-4 h-4" /> Neu
        </button>
      </div>

      <div className="mb-4 bg-[#C9963B]/8 border border-[#C9963B]/25 rounded-lg p-3 text-xs text-muted-foreground">
        <strong className="text-[#C9963B]">Hinweis:</strong> Veröffentliche nur echte Projekte. Solange weniger als 3 echte Projekte „Veröffentlicht“ sind, zeigt die Website automatisch Beispiel-Formate.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(it => (
          <div key={it.id} className="bg-card clean-border rounded-xl overflow-hidden">
            <div className="aspect-video bg-background flex items-center justify-center">
              {previews[it.id]
                ? <img src={previews[it.id] as string} alt={it.title} className="w-full h-full object-cover" />
                : <span className="text-xs text-muted-foreground">Kein Thumbnail</span>}
            </div>
            <div className="p-4">
              <div className="font-bold">{it.title}</div>
              <div className="text-xs text-muted-foreground">
                {[it.category, it.platform, it.project_goal].filter(Boolean).join(' · ') || `Sort ${it.sort_order}`}
              </div>
              <div className="text-xs mt-2 mb-3 flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded ${it.published ? 'bg-green-500/15 text-green-500' : 'bg-yellow-500/15 text-yellow-500'}`}>
                  {it.published ? 'Veröffentlicht' : 'Entwurf'}
                </span>
                {it.featured && <span className="px-2 py-0.5 rounded bg-[#C9963B]/15 text-[#C9963B]">Featured</span>}
                {it.format_badge && <span className="px-2 py-0.5 rounded bg-foreground/10 text-muted-foreground">{it.format_badge}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(it)} className="px-3 py-1 rounded border border-border text-sm">Bearbeiten</button>
                <button onClick={() => remove(it.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 bg-card clean-border rounded-xl p-8 text-center">
            <div className="font-semibold mb-1">Noch keine Projekte veröffentlicht</div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">Bis echte Arbeiten vorhanden sind, zeigt die Website Beispiel-Formate.</p>
            <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#C9963B] text-[#0A0A0A] font-semibold">
              <Plus className="w-4 h-4" /> Erstes Projekt anlegen
            </button>
          </div>
        )}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? 'Bearbeiten' : 'Neu'}>
          <div className="space-y-3 text-sm">
            <FieldRow field={{ key: 'title', label: 'Titel' }} value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
            <FieldRow field={{ key: 'category', label: 'Kategorie' }} value={editing.category} onChange={v => setEditing({ ...editing, category: v })} />
            <FieldRow field={{ key: 'description', label: 'Beschreibung', type: 'textarea' }} value={editing.description} onChange={v => setEditing({ ...editing, description: v })} />
            <FieldRow field={{ key: 'format_badge', label: 'Format Badge', placeholder: '9:16 / 1:1 / 16:9' }} value={editing.format_badge} onChange={v => setEditing({ ...editing, format_badge: v })} />

            <div>
              <label className="block text-xs uppercase text-muted-foreground mb-1">Thumbnail (JPG, PNG, WebP · max. 5 MB)</label>
              <div className="flex items-center gap-2">
                <input value={editing.thumbnail_url ?? ''} onChange={e => setEditing({ ...editing, thumbnail_url: e.target.value })} className={inp} placeholder="URL oder Storage-Pfad" />
                <label className="px-3 py-2 rounded-md border border-border cursor-pointer hover:bg-foreground/5 inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5" /> {uploading === 'thumb' ? 'Lädt…' : 'Upload'}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={!!uploading} onChange={async e => {
                    const f = e.target.files?.[0]; e.target.value = ''; if (!f) return
                    const path = await uploadFile(f, 'thumb')
                    if (path) setEditing({ ...editing, thumbnail_url: path })
                  }} />
                </label>
              </div>
              {editing.thumbnail_url && /^https?:\/\//.test(editing.thumbnail_url) && (
                <img src={editing.thumbnail_url} alt="" className="mt-2 max-h-40 rounded border border-border" />
              )}
            </div>

            <div>
              <label className="block text-xs uppercase text-muted-foreground mb-1">Video (MP4, WebM · max. 80 MB)</label>
              <div className="flex items-center gap-2">
                <input value={editing.video_url ?? ''} onChange={e => setEditing({ ...editing, video_url: e.target.value })} className={inp} placeholder="URL oder Storage-Pfad" />
                <label className="px-3 py-2 rounded-md border border-border cursor-pointer hover:bg-foreground/5 inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5" /> {uploading === 'video' ? 'Lädt…' : 'Upload'}
                  <input type="file" accept="video/mp4,video/webm" className="hidden" disabled={!!uploading} onChange={async e => {
                    const f = e.target.files?.[0]; e.target.value = ''; if (!f) return
                    const path = await uploadFile(f, 'video')
                    if (path) setEditing({ ...editing, video_url: path })
                  }} />
                </label>
              </div>
              {editing.video_url && /^https?:\/\//.test(editing.video_url) && (
                <video src={editing.video_url} controls className="mt-2 max-h-48 rounded border border-border" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FieldRow field={{ key: 'platform', label: 'Plattform', placeholder: 'Meta · TikTok · Shopify' }} value={editing.platform} onChange={v => setEditing({ ...editing, platform: v })} />
              <FieldRow field={{ key: 'project_goal', label: 'Ziel / Use Case', placeholder: 'z. B. Sales, Launch' }} value={editing.project_goal} onChange={v => setEditing({ ...editing, project_goal: v })} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FieldRow field={{ key: 'sort_order', label: 'Reihenfolge', type: 'number' }} value={editing.sort_order} onChange={v => setEditing({ ...editing, sort_order: v })} />
              <label className="flex items-end gap-2 pb-2">
                <input type="checkbox" checked={!!editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} />
                <span>Als Featured markieren</span>
              </label>
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
