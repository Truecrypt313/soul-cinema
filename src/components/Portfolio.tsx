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
  { id: 'f1', title: 'Physisches Produkt — Social Ad', category: 'Performance Creative', description: '9:16 Creative für Instagram Reels, TikTok und Meta Ads.', video_url: null, thumbnail_url: null, format_badge: '9:16' },
  { id: 'f2', title: 'Digitales Produkt — Feature Video', category: 'Produktstory', description: 'Kurzes Video, das ein Tool, eine App oder ein digitales Angebot präsentiert.', video_url: null, thumbnail_url: null, format_badge: '9:16' },
  { id: 'f3', title: 'E-Commerce Creative', category: 'Shop & Landingpage', description: 'Produktvideo für Shop, Landingpage und Performance-Kampagnen.', video_url: null, thumbnail_url: null, format_badge: '1:1' },
  { id: 'f4', title: 'Launch Creative', category: 'Kampagne', description: 'Video-Asset für einen Produktlaunch oder Kampagnenstart.', video_url: null, thumbnail_url: null, format_badge: '16:9' },
  { id: 'f5', title: 'Brand Product Video', category: 'Marke', description: 'Hochwertiges Produktvideo für Website, Shop und Social Media.', video_url: null, thumbnail_url: null, format_badge: '16:9' },
  { id: 'f6', title: 'Content Package', category: 'Varianten', description: 'Mehrere Varianten für Hooks, Formate und Kampagnentests.', video_url: null, thumbnail_url: null, format_badge: '9:16' },
]

export function Portfolio() {
  const [items, setItems] = useState<Item[]>(FALLBACK)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let active = true
    supabase
      .from('portfolio_items')
      .select('id, title, category, description, video_url, thumbnail_url, format_badge')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (active && data && data.length > 0) {
          setItems(data as Item[])
          setIsLive(true)
        }
      })
    return () => { active = false }
  }, [])

  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">{isLive ? 'Portfolio' : 'Ausgewählte Projekte'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] leading-tight tracking-tight mb-5">
            Arbeiten, die Produkte sichtbar machen.
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            <span className="text-highlight">Produktvideos</span>, <span className="text-highlight">Social Ads</span> und Performance Creatives für <span className="text-highlight">Marken, Shops und digitale Produkte</span>.
          </p>
          {!isLive && (
            <p className="mt-3 text-xs text-[#A8A29E]/70 uppercase tracking-wider">Beispielhafte Formate · Referenzen folgen</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl">
          {items.map(item => (
            <article
              key={item.id}
              className="group bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#C9963B]/40 gentle-animation"
            >
              <div className="relative aspect-[4/5] bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-black overflow-hidden">
                {item.video_url ? (
                  <video
                    src={item.video_url}
                    poster={item.thumbnail_url ?? undefined}
                    className="w-full h-full object-cover"
                    muted loop playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-[#C9963B]/40 flex items-center justify-center group-hover:bg-[#C9963B]/10 transition-colors">
                      <Play className="w-6 h-6 text-[#C9963B]" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 gentle-animation" />
                {item.format_badge && (
                  <span className="absolute top-4 right-4 glass-effect text-[#F4F0E8] text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wider">
                    {item.format_badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                {item.category && (
                  <span className="text-[10px] font-semibold text-[#C9963B] uppercase tracking-[0.18em]">
                    {item.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-[#F4F0E8] mt-2 mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-[#A8A29E] text-sm leading-relaxed">{item.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#contact" className="inline-flex items-center gap-2 text-[#C9963B] font-semibold hover:text-[#F4F0E8] gentle-animation">
            Projekt anfragen →
          </a>
        </div>
      </div>
    </section>
  )
}
