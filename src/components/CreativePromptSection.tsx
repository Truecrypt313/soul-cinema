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

const LINES: Line[] = [
  { kind: 'label', text: 'Prompt' },
  { kind: 'prompt', text: 'Mach aus meinem Produkt einen Scroll-Stopper.' },
  { kind: 'spacer' },
  { kind: 'label', text: 'Input' },
  { kind: 'kv', key: 'Produkt', value: 'Dein Produkt / App / Shop' },
  { kind: 'kv', key: 'Ziel',    value: 'Mehr Aufmerksamkeit & Klicks' },
  { kind: 'kv', key: 'Format',  value: '9:16 · 1:1 · 16:9' },
  { kind: 'kv', key: 'Style',   value: 'UGC · cinematic · clean · bold' },
  { kind: 'spacer' },
  { kind: 'label', text: 'Output' },
  { kind: 'output', key: 'Hook 01', value: 'Problem → Produkt → CTA' },
  { kind: 'output', key: 'Hook 02', value: 'Unboxing → Benefit → Proof' },
  { kind: 'output', key: 'Hook 03', value: 'Fast Cut → Feature → Action' },
  { kind: 'output', key: 'Hero Clip', value: '+ Social Cutdowns' },
  { kind: 'spacer' },
  { kind: 'status', text: 'Ready to launch' },
]

const STICKERS = [
  { label: '9:16 Ads',      cls: 'bg-soft-coral text-primary',           rot: '-rotate-6', pos: 'top-2 -left-2 md:-left-6' },
  { label: 'Hook First',    cls: 'bg-soft-pink text-secondary',           rot: 'rotate-3',  pos: 'top-4 -right-3 md:-right-8' },
  { label: 'UGC Look',      cls: 'bg-soft-blue text-foreground',          rot: '-rotate-3', pos: 'bottom-6 -left-3 md:-left-10' },
  { label: 'Scroll Stopper',cls: 'bg-soft-lavender text-foreground',      rot: 'rotate-6',  pos: 'bottom-2 -right-2 md:-right-6' },
]

const MARQUEE_ITEMS = [
  '9:16 Ads', 'Product Videos', 'Launch Clips', 'UGC Style',
  'Social Cutdowns', 'Hook Variants', 'Shop Creatives', 'Cinematic Cuts',
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
      transition: { delay: reduce ? 0 : 0.04 * i, duration: 0.35, ease: 'easeOut' as const },
    }),
  }

  return (
    <section
      id="creative-prompt"
      aria-label="Creative Prompt"
      className="relative py-20 md:py-28 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Headline */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-coral text-primary text-xs font-medium uppercase tracking-wider mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Creative Brief
          </div>
          <h2 className="font-brand text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-foreground">
            So entsteht dein{' '}
            <span className="text-gradient-brand italic">Scroll-Stopper</span>.
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Vom Produkt zum fertigen Ad-Konzept — Format, Hook und Cutdown in einem Brief.
          </p>
        </div>

        {/* Card + Stickers */}
        <div ref={ref} className="relative max-w-3xl mx-auto">
          {/* Floating stickers — hidden on small screens to avoid overlap */}
          {STICKERS.map((s, i) => (
            <motion.span
              key={s.label}
              aria-hidden
              className={`hidden md:inline-flex absolute z-20 items-center rounded-full px-3 py-1.5 text-xs font-semibold shadow-md ring-1 ring-border ${s.cls} ${s.rot} ${s.pos}`}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              style={
                reduce
                  ? undefined
                  : {
                      animation: `floatY ${5 + i}s ease-in-out ${i * 0.3}s infinite`,
                    }
              }
            >
              {s.label}
            </motion.span>
          ))}

          <div className="relative rounded-2xl border border-border bg-card shadow-[0_24px_60px_-24px_rgba(20,17,13,0.18)] overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0]/80" />
                <span className="ml-3 text-xs font-mono text-muted-foreground">creative-brief.txt</span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> live
              </span>
            </div>

            {/* Body */}
            <div className="p-6 md:p-10 font-mono text-sm md:text-[15px] leading-relaxed">
              {LINES.map((line, i) => {
                if (line.kind === 'spacer') return <div key={i} className="h-3" aria-hidden />

                return (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate={inView ? 'show' : 'hidden'}
                    className="flex flex-wrap gap-x-3"
                  >
                    {line.kind === 'label' && (
                      <span className="text-secondary font-semibold">{line.text}:</span>
                    )}
                    {line.kind === 'prompt' && (
                      <span className="text-foreground">
                        <span className="text-primary mr-2">{'>'}</span>
                        {line.text}
                      </span>
                    )}
                    {line.kind === 'kv' && (
                      <>
                        <span className="text-muted-foreground w-20 md:w-24 shrink-0">{line.key}</span>
                        <span className="text-foreground break-words">→ {line.value}</span>
                      </>
                    )}
                    {line.kind === 'output' && (
                      <span className="text-foreground break-words">
                        <span className="text-primary mr-2">▸</span>
                        <span className="text-secondary font-semibold mr-2">{line.key}</span>
                        {line.value}
                      </span>
                    )}
                    {line.kind === 'status' && (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-soft-coral text-primary font-semibold text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          {line.text}
                          <span className="cursor-blink">_</span>
                        </span>
                      </span>
                    )}
                  </motion.div>
                )
              })}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: reduce ? 0 : 0.04 * LINES.length + 0.2, duration: 0.4 }}
                className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <p className="text-xs text-muted-foreground font-sans max-w-sm">
                  Jedes Projekt startet mit einem kurzen Brief — keine Templates, keine Fließband-Ads.
                </p>
                <Button onClick={handleCta} className="group">
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
        <div className="mt-16 md:mt-20 relative overflow-hidden border-y border-border py-4">
          <div className="marquee-track flex gap-8 whitespace-nowrap text-sm md:text-base font-medium text-muted-foreground">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                {item}
                <span className="text-primary" aria-hidden>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0) var(--tw-rotate, rotate(0)); }
          50%      { transform: translateY(-6px) var(--tw-rotate, rotate(0)); }
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
          animation: marqueeScroll 40s linear infinite;
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
