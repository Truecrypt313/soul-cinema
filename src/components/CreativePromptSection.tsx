'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { track } from '@/lib/analytics'

type LineKind = 'label' | 'prompt' | 'kv' | 'output' | 'status' | 'spacer'
interface Line {
  kind: LineKind
  key?: string
  value?: string
  text?: string
}

const INPUT_LINES: Line[] = [
  { kind: 'kv', key: 'Produkt',   value: 'Produktlink, Bilder oder App/Shop' },
  { kind: 'kv', key: 'Ziel',      value: 'Aufmerksamkeit, Klicks, Vertrauen' },
  { kind: 'kv', key: 'Plattform', value: 'TikTok · Meta · YouTube · Shop' },
  { kind: 'kv', key: 'Look',      value: 'UGC · cinematic · clean · bold' },
  { kind: 'kv', key: 'Material',  value: 'Bilder · Clips · Link · Briefing' },
]

const OUTPUT_LINES: Line[] = [
  { kind: 'output', key: 'Hook 01',   value: 'Problem → Produkt → CTA' },
  { kind: 'output', key: 'Hook 02',   value: 'Unboxing → Benefit → Proof' },
  { kind: 'output', key: 'Hook 03',   value: 'Fast Cut → Feature → Action' },
  { kind: 'output', key: 'Hero Clip', value: 'für Website & Landingpage' },
  { kind: 'output', key: 'Cutdowns',  value: '9:16 · 1:1 · 16:9 für Social Ads' },
]

const STICKERS = [
  { label: 'Scroll-Stopper', cls: 'bg-soft-coral text-primary',      rot: '-rotate-6', pos: 'top-2 -left-3 md:-left-8' },
  { label: 'Hook First',     cls: 'bg-soft-pink text-secondary',      rot: 'rotate-3',  pos: 'top-6 -right-3 md:-right-10' },
  { label: 'Shop Ready',     cls: 'bg-soft-blue text-foreground',     rot: '-rotate-3', pos: 'bottom-8 -left-3 md:-left-12' },
  { label: 'Launch Clip',    cls: 'bg-soft-lavender text-foreground', rot: 'rotate-6',  pos: 'bottom-2 -right-2 md:-right-8' },
]

const MARQUEE_ITEMS = [
  'Product Videos', 'Social Ads', 'Hook Variants', 'UGC Style',
  'Launch Clips', 'Shop Creatives', 'App Videos', 'Cinematic Cuts', '9:16 Cutdowns',
]

export function CreativePromptSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  const handleCta = () => {
    track({ event_name: 'cta_click', cta_id: 'creative_prompt_brief', section_key: 'creative_prompt' })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const lineVariants = {
    hidden: { opacity: 0, y: 6 },
    show: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: reduce ? 0 : 0.05 * i, duration: 0.35, ease: 'easeOut' as const },
    }),
  }

  return (
    <section
      id="creative-prompt"
      aria-label="Creative Brief"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Soft brand gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at top, hsl(var(--soft-coral) / 0.18), transparent 60%), radial-gradient(ellipse at bottom right, hsl(var(--soft-blue) / 0.14), transparent 55%)',
        }}
      />

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Headline */}
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-coral text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Creative Brief
          </div>
          <h2 className="font-brand text-4xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight text-foreground">
            Aus Produkt wird{' '}
            <span className="text-gradient-brand italic">Performance-Creative</span>.
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Du gibst uns Produktlink, Bilder oder vorhandenes Material. Wir entwickeln daraus Hooks, Formate und Video-Ads, die in Feeds auffallen.
          </p>
        </div>

        {/* Card */}
        <div ref={ref} className="relative max-w-4xl mx-auto">

          <div className="relative rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-[0_30px_80px_-30px_rgba(20,17,13,0.22)] overflow-hidden">
            {/* Top highlight line */}
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)' }}
            />

            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/15" />
                <span className="w-2 h-2 rounded-full bg-foreground/15" />
                <span className="w-2 h-2 rounded-full bg-foreground/15" />
                <span className="ml-3 text-xs font-mono text-muted-foreground">creative-brief.md</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> live
              </span>
            </div>

            {/* Body */}
            <div className="p-6 md:p-12 font-mono text-sm md:text-[15px] leading-relaxed">
              {/* Prompt */}
              <motion.div
                custom={0}
                variants={lineVariants}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
              >
                <div className="text-secondary font-semibold mb-2">Prompt</div>
                <div className="text-foreground break-words">
                  <span className="text-primary mr-2">{'>'}</span>
                  Mach aus meinem Produkt ein Ad, das hängen bleibt.
                </div>
              </motion.div>

              {/* Input */}
              <div className="mt-7">
                <motion.div
                  custom={1}
                  variants={lineVariants}
                  initial="hidden"
                  animate={inView ? 'show' : 'hidden'}
                  className="text-secondary font-semibold mb-3"
                >
                  Input
                </motion.div>
                <div className="space-y-1.5">
                  {INPUT_LINES.map((line, i) => (
                    <motion.div
                      key={i}
                      custom={i + 2}
                      variants={lineVariants}
                      initial="hidden"
                      animate={inView ? 'show' : 'hidden'}
                      className="flex flex-wrap gap-x-3"
                    >
                      <span className="text-muted-foreground w-24 md:w-28 shrink-0">{line.key}</span>
                      <span className="text-foreground break-words whitespace-normal">→ {line.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Output */}
              <div className="mt-7">
                <motion.div
                  custom={7}
                  variants={lineVariants}
                  initial="hidden"
                  animate={inView ? 'show' : 'hidden'}
                  className="text-secondary font-semibold mb-3"
                >
                  Output
                </motion.div>
                <div className="space-y-1.5 border-l-2 border-primary/40 pl-4">
                  {OUTPUT_LINES.map((line, i) => (
                    <motion.div
                      key={i}
                      custom={i + 8}
                      variants={lineVariants}
                      initial="hidden"
                      animate={inView ? 'show' : 'hidden'}
                      className="text-foreground break-words"
                    >
                      <span className="text-primary mr-2">▸</span>
                      <span className="text-secondary font-semibold mr-2">{line.key}</span>
                      {line.value}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <motion.div
                custom={14}
                variants={lineVariants}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                className="mt-7 flex items-center gap-3 flex-wrap"
              >
                <span className="text-muted-foreground">Status:</span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft-coral text-primary font-semibold text-xs shadow-[0_0_24px_-6px_hsl(var(--primary)/0.5)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Ready for launch
                  <span className="cursor-blink">_</span>
                </span>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: reduce ? 0 : 0.9, duration: 0.4 }}
                className="mt-9 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <p className="text-xs md:text-sm text-muted-foreground font-sans max-w-md leading-relaxed">
                  Kein Template. Kein Standard-Ad. Jedes Video startet mit einer klaren Creative-Idee.
                </p>
                <Button onClick={handleCta} size="lg" className="group shrink-0">
                  Projekt briefen
                  <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Mobile stickers (in-flow) */}
          <div className="md:hidden mt-6 flex flex-wrap justify-center gap-2">
            {STICKERS.map(s => (
              <span
                key={s.label}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-border ${s.cls} ${s.rot}`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-16 md:mt-24 relative overflow-hidden border-y border-border py-5">
          <div className="marquee-track flex gap-10 whitespace-nowrap text-sm md:text-base font-medium text-muted-foreground">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-10">
                {item}
                <span className="text-primary" aria-hidden>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes cursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .cursor-blink {
          display: inline-block;
          margin-left: 2px;
          animation: cursorBlink 1s steps(1) infinite;
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .marquee-track {
          animation: marqueeScroll 55s linear infinite;
          width: max-content;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track,
          .cursor-blink { animation: none !important; }
        }
      `}</style>
    </section>
  )
}

export default CreativePromptSection
