'use client'

import { track } from '@/lib/analytics'
import tile1 from '@/assets/team-member-1.png'
import tile2 from '@/assets/team-member-2.png'
import tile3 from '@/assets/team-member-3.png'
import tile4 from '@/assets/team-member-4.png'
import tile5 from '@/assets/team-member-5.png'
import tile6 from '@/assets/team-member-6.png'
import tile7 from '@/assets/team-member-7.png'

type Tile = { src: string; label: string }

const TILES: Tile[] = [
  { src: tile1, label: 'UGC Hook' },
  { src: tile2, label: 'Cinematic Product' },
  { src: tile3, label: 'App Demo' },
  { src: tile4, label: 'E-Commerce Reel' },
  { src: tile5, label: 'Launch Teaser' },
  { src: tile6, label: 'Founder Ad' },
  { src: tile7, label: 'Before / After' },
]

export function CreatorCarousel() {
  const goContact = () => {
    track({ event_name: 'cta_click', cta_id: 'creator_carousel_contact', section_key: 'creative_styles' })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Order so middle is largest: [outer, neighbor, mid, NEIGHBOR, MID, NEIGHBOR, mid, neighbor, outer]
  // We'll just pick a center index and compute sizes relative to it.
  const centerIdx = Math.floor(TILES.length / 2)

  const sizeFor = (i: number) => {
    const d = Math.abs(i - centerIdx)
    if (d === 0) return 'w-24 h-24 sm:w-28 sm:h-28 ring-2 ring-[#C9963B] ring-offset-2 ring-offset-background'
    if (d === 1) return 'w-16 h-16 sm:w-20 sm:h-20'
    if (d === 2) return 'w-14 h-14 sm:w-16 sm:h-16 opacity-80'
    return 'w-12 h-12 sm:w-14 sm:h-14 opacity-60'
  }

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
        {TILES.map((t, i) => (
          <div key={t.label} className="flex flex-col items-center gap-2 group">
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
          {TILES.map((t) => (
            <div key={t.label} className="snap-center shrink-0 flex flex-col items-center gap-2">
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
