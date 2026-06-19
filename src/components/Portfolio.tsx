'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Play, X } from 'lucide-react'
import { resolveMany } from '@/lib/portfolioMedia'

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

function VideoModal({ src, poster, onClose }: { src: string; poster: string | null; onClose: () => void }) {
  const [err, setErr] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Schließen"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-black/60 border border-[#C9963B]/40 text-foreground hover:bg-[#C9963B]/20 transition-colors flex items-center justify-center"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        {err ? (
          <div className="aspect-video bg-black border border-white/10 rounded-lg flex items-center justify-center p-6 text-center">
            <p className="text-sm text-muted-foreground max-w-md">
              Video konnte nicht geladen werden. Prüfe Datei, Codec oder Storage-URL.
            </p>
          </div>
        ) : (
          <video
            src={src}
            poster={poster ?? undefined}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onError={(e) => {
              const el = e.currentTarget as HTMLVideoElement
              console.warn('[Portfolio] modal video error', {
                src,
                hasPoster: !!poster,
                code: el.error?.code,
                message: el.error?.message,
              })
              setErr(true)
            }}
            className="w-full max-h-[85vh] rounded-lg bg-black shadow-2xl"
          />
        )}
      </div>
    </div>
  )
}

export function Portfolio() {
  const [items, setItems] = useState<Item[]>(FALLBACK)
  const [liveCount, setLiveCount] = useState(0)
  const [resolved, setResolved] = useState<Record<string, string | null>>({})
  const [active, setActive] = useState<{ src: string; poster: string | null } | null>(null)

  useEffect(() => {
    let active = true
    supabase
      .from('portfolio_items')
      .select('id, title, category, description, video_url, thumbnail_url, format_badge, platform, project_goal, featured')
      .eq('published', true)
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .then(async ({ data }) => {
        if (!active) return
        if (data && data.length > 0) {
          setItems(data as Item[])
          setLiveCount(data.length)
          const map = await resolveMany(data.flatMap(d => [d.video_url, d.thumbnail_url]))
          if (active) setResolved(map)
        }
      })
    return () => { active = false }
  }, [])

  const urlFor = (v: string | null | undefined) => (v ? resolved[v] ?? null : null)

  const hasRealCases = liveCount >= 3
  return (
    <section className="relative py-28 sm:py-32 bg-background border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">{hasRealCases ? 'Portfolio' : 'Beispiel-Formate'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-5">
            {hasRealCases ? 'Ausgewählte Arbeiten.' : 'Beispiel-Formate für dein Produkt.'}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {hasRealCases
              ? <><span className="text-highlight">Produktvideos</span>, <span className="text-highlight">Social Ads</span> und Performance Creatives für <span className="text-highlight">Marken, Shops und digitale Produkte</span>.</>
              : 'Noch keine finalen Referenzen veröffentlicht. Diese Formate zeigen, welche Arten von Creatives Soul Cinema produzieren kann.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl">
          {items.map(item => {
            const videoUrl = urlFor(item.video_url)
            const thumbUrl = urlFor(item.thumbnail_url)
            const playable = !!videoUrl
            return (
              <article
                key={item.id}
                className={`group bg-card border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#C9963B]/40 gentle-animation ${playable ? 'cursor-pointer' : ''}`}
                onClick={() => { if (playable && videoUrl) setActive({ src: videoUrl, poster: thumbUrl }) }}
              >
                <div className="relative aspect-[4/5] bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-black overflow-hidden">
                  {videoUrl ? (
                    <VideoPreview src={videoUrl} poster={thumbUrl} />
                  ) : thumbUrl ? (
                    <img src={thumbUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-[#C9963B]/40 flex items-center justify-center group-hover:bg-[#C9963B]/10 transition-colors">
                        <Play className="w-6 h-6 text-[#C9963B]" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 gentle-animation pointer-events-none" />
                  {playable && (
                    <button
                      type="button"
                      aria-label={`${item.title} abspielen`}
                      onClick={(e) => { e.stopPropagation(); if (videoUrl) setActive({ src: videoUrl, poster: thumbUrl }) }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="w-16 h-16 rounded-full bg-black/55 border border-[#C9963B]/60 flex items-center justify-center group-hover:bg-[#C9963B]/25 transition-colors backdrop-blur-sm">
                        <Play className="w-6 h-6 text-[#C9963B] translate-x-0.5" fill="currentColor" />
                      </span>
                    </button>
                  )}
                  {item.format_badge && (
                    <span className="absolute top-4 right-4 glass-effect text-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wider pointer-events-none">
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
                  <h3 className="text-lg font-bold text-foreground mt-2 mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-[#A8A29E] text-sm leading-relaxed mb-3">{item.description}</p>
                  )}
                  {(item.platform || item.project_goal) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#A8A29E] border-t border-white/[0.05] pt-3">
                      {item.platform && <span><span className="text-[#A8A29E]/60">Plattform · </span><span className="text-foreground">{item.platform}</span></span>}
                      {item.project_goal && <span><span className="text-[#A8A29E]/60">Ziel · </span><span className="text-foreground">{item.project_goal}</span></span>}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <a href="#contact" className="inline-flex items-center gap-2 text-[#C9963B] font-semibold hover:text-foreground gentle-animation">
            Projekt anfragen →
          </a>
        </div>
      </div>

      {active && <VideoModal src={active.src} poster={active.poster} onClose={() => setActive(null)} />}
    </section>
  )
}

function VideoPreview({ src, poster }: { src: string; poster: string | null }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [err, setErr] = useState(false)
  if (err) {
    return poster ? (
      <img src={poster} alt="" className="w-full h-full object-cover" loading="lazy" />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-muted-foreground">
        Video konnte nicht geladen werden.
      </div>
    )
  }
  return (
    <video
      ref={ref}
      src={src}
      poster={poster ?? undefined}
      className="w-full h-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
      onMouseEnter={(e) => { void e.currentTarget.play().catch(() => {}) }}
      onMouseLeave={(e) => { e.currentTarget.pause() }}
      onError={(e) => {
        const el = e.currentTarget as HTMLVideoElement
        console.warn('[Portfolio] preview video error', {
          src,
          hasPoster: !!poster,
          code: el.error?.code,
          message: el.error?.message,
        })
        setErr(true)
      }}
    />
  )
}
