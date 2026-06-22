'use client'
import { Sparkles, LayoutGrid, Play, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeUp } from './FadeUp'
import { track } from '@/lib/analytics'

type Variant = 'coral' | 'blue' | 'tangerine'

function GradientAvatar({ variant, children }: { variant: Variant; children: React.ReactNode }) {
  const gradients: Record<Variant, [string, string]> = {
    coral: ['#FF8A5C', '#FF6FB5'],
    blue: ['#9EDEF9', '#C9B8FB'],
    tangerine: ['#FFB37A', '#FF6FB5'],
  }
  const [from, to] = gradients[variant]
  const id = `grad-${variant}`
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 56 56" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r="28" fill={`url(#${id})`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-white">
        {children}
      </div>
    </div>
  )
}

type Card = {
  label: string
  variant: Variant
  icon: React.ReactNode
  headline: string
  text: string
  highlight: string
  quote: string
}

const CARDS: Card[] = [
  {
    label: 'D2C Brand',
    variant: 'coral',
    icon: <Sparkles className="h-6 w-6" strokeWidth={2.25} />,
    headline: 'Vom Produktbild zur Kampagnen-Idee.',
    text: 'Aus vorhandenem Material entsteht ein Creative, das nicht nur schön aussieht, sondern direkt als Social Ad, Shop-Video oder Launch-Clip gedacht ist.',
    highlight: 'Hook-Varianten statt nur ein einzelner Clip',
    quote: 'Endlich sieht das Produkt so aus, wie es sich anfühlen soll.',
  },
  {
    label: 'App / SaaS',
    variant: 'blue',
    icon: <LayoutGrid className="h-6 w-6" strokeWidth={2.25} />,
    headline: 'Komplexe Produkte werden schnell verständlich.',
    text: 'Funktionen, Vorteile und Use Cases werden so reduziert, dass Nutzer in wenigen Sekunden verstehen, warum das Produkt relevant ist.',
    highlight: 'Ideal für Landingpage, Demo und Paid Ads',
    quote: 'Man versteht die App, bevor man überhaupt scrollt.',
  },
  {
    label: 'E-Commerce',
    variant: 'tangerine',
    icon: <Play className="h-6 w-6 fill-current" strokeWidth={2.25} />,
    headline: 'Mehr Energie für Shop, Reels und Ads.',
    text: 'Produktvideos bekommen den richtigen Rhythmus für moderne Feeds: schnell genug für TikTok und Reels, hochwertig genug für Website und Brand-Auftritt.',
    highlight: '9:16, 1:1 und 16:9 Cutdowns',
    quote: 'Das wirkt wie Content — nicht wie klassische Werbung.',
  },
]

const PILLS: { label: string; tint: string }[] = [
  { label: 'Klare Hooks', tint: 'bg-[#FFE9DE] text-[#8a3a1a] dark:bg-[rgba(255,138,92,0.14)] dark:text-[#FFC7A8]' },
  { label: 'Social-Ready Formate', tint: 'bg-[#FFE8F3] text-[#8a2a5a] dark:bg-[rgba(255,111,181,0.14)] dark:text-[#FFB8DA]' },
  { label: 'Produktfokus', tint: 'bg-[#EAF7FD] text-[#0e4a66] dark:bg-[rgba(158,222,249,0.14)] dark:text-[#BDE6F8]' },
  { label: 'Schneller Briefing-Prozess', tint: 'bg-[#F0EAFE] text-[#3d2a7a] dark:bg-[rgba(201,184,251,0.14)] dark:text-[#D6C9FB]' },
]

function smoothScroll(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function TrustSignals() {
  const handlePrimary = () => {
    track({ event_name: 'cta_click', cta_id: 'trust_brief', section_key: 'trust_section' })
    smoothScroll('contact')
  }
  const handleSecondary = () => {
    track({ event_name: 'cta_click', cta_id: 'trust_portfolio', section_key: 'trust_section' })
    smoothScroll('portfolio')
  }

  return (
    <section
      aria-label="Wirkung"
      className="relative py-24 sm:py-28 bg-background border-t border-white/[0.04] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            'radial-gradient(ellipse at top left, hsl(14 100% 70% / 0.18), transparent 55%), radial-gradient(ellipse at bottom right, hsl(199 88% 80% / 0.18), transparent 55%)',
        }}
      />
      <div className="container relative mx-auto px-6 sm:px-8 lg:px-12">
        <FadeUp className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Wirkung</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Was starke Creatives auslösen.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Soul Cinema verbindet Produktfokus, klare Hooks und moderne Formate für Website, Shop und Social Ads.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl items-stretch">
          {CARDS.map((c, i) => (
            <FadeUp key={c.label} delay={i * 0.05} className="h-full">
              <article className="group h-full bg-card border border-white/10 rounded-2xl p-6 md:p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-white/20 flex flex-col">
                <div className="flex items-center gap-4 mb-5">
                  <GradientAvatar variant={c.variant}>{c.icon}</GradientAvatar>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-background/60 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase text-foreground/80">
                    {c.label}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground leading-snug mb-3">
                    {c.headline}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.text}</p>
                </div>
                <div className="mt-auto">
                  <div className="inline-flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium text-foreground/90">
                    <Check className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                    <span>{c.highlight}</span>
                  </div>
                  <div className="mt-5 pt-5 border-t border-white/5">
                    <p className="text-sm italic text-foreground/75 leading-relaxed">„{c.quote}"</p>
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2} className="mt-10">
          <ul className="flex flex-wrap gap-2.5 justify-center md:justify-start">
            {PILLS.map((p) => (
              <li
                key={p.label}
                className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium ${p.tint}`}
              >
                {p.label}
              </li>
            ))}
          </ul>
        </FadeUp>

        <FadeUp delay={0.25} className="mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 backdrop-blur-sm p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Bereit für dein erstes Creative?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Schick uns Produktlink, Bilder oder App — wir denken daraus dein erstes Video-Konzept.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button size="lg" onClick={handlePrimary}>
                Projekt briefen
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="ghost" onClick={handleSecondary}>
                Portfolio ansehen
              </Button>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
