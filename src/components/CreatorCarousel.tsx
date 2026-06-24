'use client'

import { useEffect, useState } from 'react'
import { track } from '@/lib/analytics'
import { useCmsList } from '@/hooks/useCms'
import { resolveMany } from '@/lib/portfolioMedia'
import tile1 from '@/assets/team-member-1.png'
import tile2 from '@/assets/team-member-2.png'
import tile3 from '@/assets/team-member-3.png'
import tile4 from '@/assets/team-member-4.png'
import tile5 from '@/assets/team-member-5.png'
import tile6 from '@/assets/team-member-6.png'
import tile7 from '@/assets/team-member-7.png'

type DbRow = { id: string; label: string; image_url: string | null; sort_order: number; visible: boolean }
type Tile = { key: string; src: string; label: string }

const FALLBACK_TILES: Tile[] = [
  { key: 'f1', src: tile1, label: 'UGC Hook' },
  { key: 'f2', src: tile2, label: 'Cinematic Product' },
  { key: 'f3', src: tile3, label: 'App Demo' },
  { key: 'f4', src: tile4, label: 'E-Commerce Reel' },
  { key: 'f5', src: tile5, label: 'Launch Teaser' },
  { key: 'f6', src: tile6, label: 'Founder Ad' },
  { key: 'f7', src: tile7, label: 'Before / After' },
]

export function CreatorCarousel() {
  const rows = useCmsList<DbRow>('creative_styles', [])
  const [resolved, setResolved] = useState<Record<string, string | null>>({})

  useEffect(() => {
    let active = true
    if (!rows.length) return
    resolveMany(rows.map(r => r.image_url)).then(map => { if (active) setResolved(map) })
    return () => { active = false }
  }, [rows])

  const tiles: Tile[] = rows.length
    ? rows.map((r, i) => ({
        key: r.id,
        label: r.label,
        src: (r.image_url && resolved[r.image_url]) || FALLBACK_TILES[i % FALLBACK_TILES.length].src,
      }))
    : FALLBACK_TILES

  const goContact = () => {
    track({ event_name: 'cta_click', cta_id: 'creator_carousel_contact', section_key: 'creative_styles' })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const centerIdx = Math.floor(tiles.length / 2)

  const sizeFor = (i: number) => {
    const d = Math.abs(i - centerIdx)
    if (d === 0) return 'w-24 h-24 sm:w-28 sm:h-28 ring-2 ring-[#C9963B] ring-offset-2 ring-offset-background'
    if (d === 1) return 'w-16 h-16 sm:w-20 sm:h-20'
    if (d === 2) return 'w-14 h-14 sm:w-16 sm:h-16 opacity-80'
    return 'w-12 h-12 sm:w-14 sm:h-14 opacity-60'
  }

  if (tiles.length === 0) return null

  return (
    <section
      id="creative-styles"
      aria-label="Creative Styles"
      className="stage-section relative py-24 sm:py-32 px-4 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-coral text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Gemacht für
        </div>
        <h2 className="font-brand text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-foreground">
          Marken, die <span className="italic text-gradient-brand">wachsen</span> wollen.
        </h2>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Soul Cinema entwickelt Produktvideos und Social Ads für Shops, Startups, digitale Produkte und Marken, die sichtbar professioneller auftreten möchten.
        </p>
      </div>

      {/* Desktop tile strip */}
      <div className="hidden sm:flex items-end justify-center gap-4 mb-10">
        {tiles.map((t, i) => (
          <div key={t.key} className="flex flex-col items-center gap-2 group">
            <div
              className={`relative ${sizeFor(i)} rounded-2xl overflow-hidden border border-border transition-all duration-200 hover:scale-110 hover:opacity-100`}
            >
              <img src={t.src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {t.label}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile scrollable strip */}
      <div className="sm:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory">
        <div className="flex items-end gap-3 pb-4">
          {tiles.map((t) => (
            <div key={t.key} className="snap-center shrink-0 flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border">
                <img src={t.src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={goContact}
          aria-label="Projekt anfragen"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C9963B]/40 text-foreground hover:text-primary hover:border-primary/60 transition-colors text-sm font-medium"
        >
          <span className="text-[#C9963B]">✦</span> Dein Projekt hier
        </button>
      </div>
    </section>
  )
}

export default CreatorCarousel
