'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useSettings, setting } from '@/hooks/useCms'
import { track } from '@/lib/analytics'

const FALLBACK_VIDEO =
  'https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm'

export function MiniHeroVideo() {
  const s = useSettings()
  const videoUrl = setting<string>(s, 'hero_video_url', FALLBACK_VIDEO)
  const [videoFailed, setVideoFailed] = useState(false)

  const goContact = () => {
    track({ event_name: 'cta_click', cta_id: 'mini_showcase_contact', section_key: 'mini_showcase' })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="mini-showcase"
      aria-label="Mini Showcase"
      className="stage-section relative py-24 sm:py-32 px-4 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-coral text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Aus echten Projekten
        </div>
        <h2 className="font-brand text-4xl sm:text-6xl leading-[1.05] tracking-tight text-foreground">
          Dein Produkt im{' '}
          <span className="italic text-gradient-brand">Einsatz</span>.
        </h2>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Produktlink oder Bilder rein — fertiges Video raus.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto mt-14">
        <div className="media-card relative aspect-video rounded-2xl overflow-hidden border border-border bg-[#0A0A0A]">
          {!videoFailed ? (
            <video
              key={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setVideoFailed(true)}
              aria-label="Beispiel: Soul Cinema Produktvideo"
            >
              <source src={videoUrl} />
            </video>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]">
              <span className="font-mono text-sm text-[#F4F0E8]/70">Video Preview</span>
            </div>
          )}
        </div>

        {/* Prompt overlay */}
        <div className="relative z-10 -mt-6 flex justify-center px-2">
          <div className="prompt-glass inline-flex items-center gap-3 rounded-full px-5 py-3 max-w-[92vw]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="font-mono text-xs sm:text-sm text-[#F4F0E8]/90 whitespace-nowrap overflow-hidden text-ellipsis">
              → Produktvideo · Hook-Cut · 9:16 · Meta Ready
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={goContact}
          aria-label="Projekt anfragen"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground hover:text-primary hover:border-primary/50 transition-colors text-sm font-medium"
        >
          Jetzt Projekt anfragen
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  )
}

export default MiniHeroVideo
