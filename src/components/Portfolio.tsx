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
  platform: string | null
  project_goal: string | null
  featured: boolean | null
}

const FALLBACK: Item[] = [
  { id: 'f1', title: 'Physisches Produkt — Social Ad', category: 'Beispiel-Format', description: '9:16 Creative für Instagram Reels, TikTok und Meta Ads.', video_url: null, thumbnail_url: null, format_badge: '9:16', platform: 'Meta · TikTok', project_goal: 'Awareness & Conversion', featured: true },
  { id: 'f2', title: 'Digitales Produkt — Feature Video', category: 'Beispiel-Format', description: 'Kurzes Video, das ein Tool, eine App oder ein digitales Angebot präsentiert.', video_url: null, thumbnail_url: null, format_badge: '9:16', platform: 'Landingpage', project_goal: 'Sign-ups', featured: false },
  { id: 'f3', title: 'E-Commerce Creative', category: 'Mögliches Creative', description: 'Produktvideo für Shop, Landingpage und Performance-Kampagnen.', video_url: null, thumbnail_url: null, format_badge: '1:1', platform: 'Shopify · Meta', project_goal: 'Sales', featured: false },
  { id: 'f4', title: 'Launch Creative', category: 'Beispiel-Format', description: 'Video-Asset für einen Produktlaunch oder Kampagnenstart.', video_url: null, thumbnail_url: null, format_badge: '16:9', platform: 'YouTube · Web', project_goal: 'Launch', featured: false },
  { id: 'f5', title: 'Brand Product Video', category: 'Mögliches Creative', description: 'Hochwertiges Produktvideo für Website, Shop und Social Media.', video_url: null, thumbnail_url: null, format_badge: '16:9', platform: 'Website', project_goal: 'Brand', featured: false },
  { id: 'f6', title: 'Content Package', category: 'Beispiel-Format', description: 'Mehrere Varianten für Hooks, Formate und Kampagnentests.', video_url: null, thumbnail_url: null, format_badge: '9:16', platform: 'Meta · TikTok', project_goal: 'A/B-Tests', featured: false },
]

export function Portfolio() {
  const [items, setItems] = useState<Item[]>(FALLBACK)
  const [liveCount, setLiveCount] = useState(0)

  useEffect(() => {
    let active = true
    supabase
      .from('portfolio_items')
      .select('id, title, category, description, video_url, thumbnail_url, format_badge, platform, project_goal, featured')
      .eq('published', true)
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (active && data && data.length > 0) {
          setItems(data as Item[])
          setLiveCount(data.length)
        }
      })
    return () => { active = false }
  }, [])

  const hasRealCases = liveCount >= 3
  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">{hasRealCases ? 'Portfolio' : 'Beispiel-Formate'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] leading-tight tracking-tight mb-5">
            {hasRealCases ? 'Ausgewählte Arbeiten.' : 'Beispiel-Formate für dein Produkt.'}
          </h2>
          <p className="text-base sm:text-lg text-[#B8B2AA] leading-relaxed">
            {hasRealCases
              ? <><span className="text-highlight">Produktvideos</span>, <span className="text-highlight">Social Ads</span> und Performance Creatives für <span className="text-highlight">Marken, Shops und digitale Produkte</span>.</>
              : 'Noch keine finalen Referenzen veröffentlicht. Diese Formate zeigen, welche Arten von Creatives Soul Cinema produzieren kann.'}
          </p>
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
                <div className="flex items-center gap-2 flex-wrap">
                  {!hasRealCases && (
                    <span className="text-[10px] font-semibold text-[#C9963B] uppercase tracking-[0.18em] bg-[#C9963B]/10 border border-[#C9963B]/30 px-2 py-0.5 rounded">Beispiel-Format</span>
                  )}
                  {hasRealCases && item.category && (
                    <span className="text-[10px] font-semibold text-[#C9963B] uppercase tracking-[0.18em]">
                      {item.category}
                    </span>
                  )}
                  {hasRealCases && item.featured && (
                    <span className="text-[10px] font-semibold text-[#0A0A0A] bg-[#C9963B] uppercase tracking-wider px-1.5 py-0.5 rounded">Featured</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#F4F0E8] mt-2 mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-[#A8A29E] text-sm leading-relaxed mb-3">{item.description}</p>
                )}
                {(item.platform || item.project_goal) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#A8A29E] border-t border-white/[0.05] pt-3">
                    {item.platform && <span><span className="text-[#A8A29E]/60">Plattform · </span><span className="text-[#F4F0E8]">{item.platform}</span></span>}
                    {item.project_goal && <span><span className="text-[#A8A29E]/60">Ziel · </span><span className="text-[#F4F0E8]">{item.project_goal}</span></span>}
                  </div>
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
