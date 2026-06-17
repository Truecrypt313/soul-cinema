'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Play } from 'lucide-react'

type Item = {
  id: string
  title: string
  category: string | null
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  format_badge: string | null
}

const FALLBACK: Item[] = [
  {
    id: 'fallback-1',
    title: 'Product Ad',
    category: 'Physisches Produkt',
    description: 'Kurzes Performance Creative für Social Ads.',
    video_url: null,
    thumbnail_url: null,
    format_badge: '9:16',
  },
  {
    id: 'fallback-2',
    title: 'Digital Product Reel',
    category: 'Digitales Produkt',
    description: 'Visuelle Story für ein digitales Produkt, Tool oder Feature.',
    video_url: null,
    thumbnail_url: null,
    format_badge: '9:16',
  },
  {
    id: 'fallback-3',
    title: 'E-Commerce Creative',
    category: 'Online-Shop',
    description: 'Produktvideo für Shop, Kampagne oder Landingpage.',
    video_url: null,
    thumbnail_url: null,
    format_badge: '1:1',
  },
]

export function Portfolio() {
  const [items, setItems] = useState<Item[]>(FALLBACK)

  useEffect(() => {
    let active = true
    supabase
      .from('portfolio_items')
      .select('id, title, category, description, video_url, thumbnail_url, format_badge')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (active && data && data.length > 0) setItems(data as Item[])
      })
    return () => { active = false }
  }, [])

  return (
    <section className="relative py-32 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">Ausgewählte Arbeiten</span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
            Ausgewählte Video-Beispiele
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Beispiele für Produktvideos, Social Ads und Performance Creatives für digitale und physische Produkte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {items.map(item => (
            <article
              key={item.id}
              className="group bg-card clean-border rounded-2xl overflow-hidden elevated-shadow gentle-animation hover:scale-[1.02]"
            >
              <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
                {item.video_url ? (
                  <video
                    src={item.video_url}
                    poster={item.thumbnail_url ?? undefined}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                      <Play className="w-8 h-8 text-white/80" />
                    </div>
                  </div>
                )}
                {item.format_badge && (
                  <span className="absolute top-4 right-4 glass-effect text-white text-xs font-medium px-3 py-1 rounded-full">
                    {item.format_badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                {item.category && (
                  <span className="text-xs font-semibold text-accent-blue uppercase tracking-wider">
                    {item.category}
                  </span>
                )}
                <h3 className="text-2xl font-black text-foreground mt-2 mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
