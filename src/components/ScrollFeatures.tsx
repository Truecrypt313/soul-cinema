'use client'

import { useEffect, useRef, useState } from 'react'
import { useSettings, setting } from '@/hooks/useCms'

const FALLBACK_VIDEO =
  'https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm'

type Feature = {
  badge: string
  title: string
  text: string
  prompt: string
  tint: string
}

const FEATURES: Feature[] = [
  {
    badge: '01 · Verstehen',
    title: 'Aus deinem Produkt wird eine Ad-Idee.',
    text: 'Kein generisches Template. Wir entwickeln Hook, Szene und Format auf dein Produkt zugeschnitten.',
    prompt: 'Input: Produktlink + Zielgruppe + Plattform',
    tint: 'hue-rotate(0deg) saturate(1)',
  },
  {
    badge: '02 · Hook',
    title: 'Mehrere Hooks, ein Produkt.',
    text: 'Für A/B-Tests und Kampagnen liefern wir verschiedene Hook-Varianten aus einem Briefing.',
    prompt: 'Hook: Problem → Produkt → Ergebnis',
    tint: 'hue-rotate(-15deg) saturate(1.25) contrast(1.05)',
  },
  {
    badge: '03 · Format',
    title: 'Alle Formate. Eine Produktion.',
    text: '9:16 für TikTok und Reels, 1:1 für Meta, 16:9 für YouTube und Shop — alles in einem Paket.',
    prompt: 'Output: 9:16 · 1:1 · 16:9 · MP4',
    tint: 'hue-rotate(20deg) saturate(1.15) brightness(1.05)',
  },
  {
    badge: '04 · Lieferung',
    title: 'Direkt bereit für deinen Workflow.',
    text: 'Fertige MP4-Dateien, plattformoptimiert, zur direkten Verwendung in Ads Manager, Shop oder Website.',
    prompt: 'Delivery: Social Ads · Shop · Landingpage',
    tint: 'hue-rotate(-30deg) saturate(0.9) contrast(1.1)',
  },
]

export function ScrollFeatures() {
  const s = useSettings()
  const videoUrl = setting<string>(s, 'hero_video_url', FALLBACK_VIDEO)
  const [activeIndex, setActiveIndex] = useState(0)
  const refs = useRef<Array<HTMLDivElement | null>>([])
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const compute = () => {
      const anchor = window.innerHeight * 0.45
      let bestIdx = 0
      let bestDist = Infinity
      refs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const dist = Math.abs(center - anchor)
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = i
        }
      })
      setActiveIndex((prev) => (prev === bestIdx ? prev : bestIdx))
    }

    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  const active = FEATURES[activeIndex]

  return (
    <section
      id="scroll-features"
      aria-label="Wie wir arbeiten"
      className="stage-section relative py-24 sm:py-32 px-4 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-coral text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Wie wir arbeiten
          </div>
          <h2 className="font-brand text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-foreground">
            Vom Briefing zum fertigen{' '}
            <span className="italic text-gradient-brand">Creative</span>.
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Wir machen den Produktionsprozess sichtbar: aus Material, Ziel und Plattform entsteht eine klare Video-Sequenz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: feature list */}
          <div className="flex flex-col gap-16 md:gap-24">
            {FEATURES.map((f, i) => (
              <div
                key={f.badge}
                ref={(el) => { refs.current[i] = el }}
                data-index={i}
                className={`pl-6 border-l-4 transition-all duration-500 ${
                  i === activeIndex
                    ? 'opacity-100 border-[#C9963B] story-step-active'
                    : 'opacity-30 border-transparent story-step-muted hover:opacity-60'
                }`}
              >
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
                  {f.badge}
                </div>
                <h3 className="font-brand text-2xl sm:text-3xl md:text-4xl leading-tight text-foreground mb-4">
                  {f.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-md">
                  {f.text}
                </p>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted/60 border border-border font-mono text-xs text-foreground/80">
                  {f.prompt}
                </div>

                {/* Mobile inline preview */}
                <div className="lg:hidden mt-6 aspect-video rounded-2xl overflow-hidden border border-border bg-[#0A0A0A] media-card">
                  <MediaPreview videoUrl={videoUrl} badge={f.badge} prompt={f.prompt} title={f.title} tint={f.tint} videoFailed={videoFailed} onError={() => setVideoFailed(true)} />
                </div>
              </div>
            ))}
          </div>

          {/* Right: sticky media card (desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-[#0A0A0A] media-card">
                <MediaPreview
                  videoUrl={videoUrl}
                  badge={active.badge}
                  prompt={active.prompt}
                  title={active.title}
                  videoFailed={videoFailed}
                  onError={() => setVideoFailed(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MediaPreview({
  videoUrl,
  badge,
  prompt,
  title,
  videoFailed,
  onError,
}: {
  videoUrl: string
  badge: string
  prompt: string
  title: string
  videoFailed: boolean
  onError: () => void
}) {
  return (
    <>
      {!videoFailed ? (
        <video
          key={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={onError}
          aria-label={`Beispielvideo zu ${title}`}
        >
          <source src={videoUrl} />
        </video>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]">
          <span className="font-mono text-sm text-[#F4F0E8]/70">Video Beispiel</span>
        </div>
      )}

      {/* Top badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="prompt-glass rounded-full px-3 py-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#F4F0E8]/90">
          {badge}
        </div>
      </div>

      {/* Bottom prompt bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="prompt-glass rounded-full px-4 py-2 font-mono text-xs sm:text-sm text-[#F4F0E8]/90 truncate">
          → {prompt}
        </div>
      </div>
    </>
  )
}

export default ScrollFeatures
