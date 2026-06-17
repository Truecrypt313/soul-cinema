'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

type Item = {
  id: string
  title: string
  category: string | null
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  format_badge: string | null
  published: boolean
  sort_order: number
}

const empty: Omit<Item, 'id'> = {
  title: '', category: '', description: '', video_url: '', thumbnail_url: '', format_badge: '', published: false, sort_order: 0,
}

export default function AdminPortfolio() {
  const { toast } = useToast()
  const [items, setItems] = useState<Item[]>([])
  const [editing, setEditing] = useState<Item | (Omit<Item, 'id'> & { id?: string }) | null>(null)

  const load = async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) return toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    setItems((data as Item[]) ?? [])
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    const payload = {
      title: editing.title,
      category: editing.category || null,
      description: editing.description || null,
      video_url: editing.video_url || null,
      thumbnail_url: editing.thumbnail_url || null,
      format_badge: editing.format_badge || null,
      published: editing.published,
      sort_order: Number(editing.sort_order) || 0,
    }
    let error
    if ('id' in editing && editing.id) {
      ({ error } = await supabase.from('portfolio_items').update(payload).eq('id', editing.id))
    } else {
      ({ error } = await supabase.from('portfolio_items').insert(payload))
    }
    if (error) return toast({ title: 'Speichern fehlgeschlagen', description: error.message, variant: 'destructive' })
    toast({ title: 'Gespeichert' })
    setEditing(null)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Eintrag löschen?')) return
    const { error } = await supabase.from('portfolio_items').delete().eq('id', id)
    if (error) return toast({ title: 'Löschen fehlgeschlagen', description: error.message, variant: 'destructive' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black">Portfolio</h1>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 rounded-md bg-foreground text-background font-semibold">
          Neuer Eintrag
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(it => (
          <div key={it.id} className="bg-card clean-border rounded-xl p-5 flex items-start justify-between gap-4">
            <div>
              <div className="font-bold">{it.title}</div>
              <div className="text-sm text-muted-foreground">{it.category}</div>
              <div className="text-xs mt-2">
                <span className={`px-2 py-0.5 rounded ${it.published ? 'bg-green-500/15 text-green-500' : 'bg-yellow-500/15 text-yellow-500'}`}>
                  {it.published ? 'Veröffentlicht' : 'Entwurf'}
                </span>
                <span className="ml-2 text-muted-foreground">Sort: {it.sort_order}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <button onClick={() => setEditing(it)} className="px-3 py-1 rounded border border-border hover:bg-foreground/5">Bearbeiten</button>
              <button onClick={() => remove(it.id)} className="px-3 py-1 rounded text-red-500 hover:bg-red-500/10">Löschen</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-muted-foreground">Noch keine Einträge.</div>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setEditing(null)}>
          <div className="bg-card clean-border rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black mb-4">{('id' in editing && editing.id) ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</h2>
            <div className="space-y-3 text-sm">
              <Field label="Titel"><input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inp} /></Field>
              <Field label="Kategorie"><input value={editing.category ?? ''} onChange={e => setEditing({ ...editing, category: e.target.value })} className={inp} /></Field>
              <Field label="Beschreibung"><textarea rows={3} value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className={inp} /></Field>
              <Field label="Video URL"><input value={editing.video_url ?? ''} onChange={e => setEditing({ ...editing, video_url: e.target.value })} className={inp} /></Field>
              <Field label="Thumbnail URL"><input value={editing.thumbnail_url ?? ''} onChange={e => setEditing({ ...editing, thumbnail_url: e.target.value })} className={inp} /></Field>
              <Field label="Format-Badge (z. B. 9:16)"><input value={editing.format_badge ?? ''} onChange={e => setEditing({ ...editing, format_badge: e.target.value })} className={inp} /></Field>
              <Field label="Sortierung"><input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inp} /></Field>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editing.published} onChange={e => setEditing({ ...editing, published: e.target.checked })} />
                Veröffentlicht
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-md border border-border">Abbrechen</button>
              <button onClick={save} className="px-4 py-2 rounded-md bg-foreground text-background font-semibold">Speichern</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inp = 'w-full px-3 py-2 rounded-md bg-background border border-border'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  )
}
