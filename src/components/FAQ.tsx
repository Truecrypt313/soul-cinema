'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FadeUp } from './FadeUp'
import { useCmsList } from '@/hooks/useCms'
import { trackFaqOpen } from '@/lib/analytics'

type Row = { id: string; question: string; answer: string }

const FALLBACK: Row[] = [
  { id: '1', question: 'Was brauche ich für ein Projekt?', answer: 'Produktbilder, vorhandenes Material oder ein Produktlink reichen für eine erste Einschätzung. Alles weitere klären wir gemeinsam.' },
  { id: '2', question: 'Wie lange dauert ein Video?', answer: 'Ein einzelnes Video typischerweise 1–2 Wochen, Kampagnen-Pakete entsprechend länger.' },
  { id: '3', question: 'Für welche Plattformen produziert ihr?', answer: 'Meta (Instagram, Facebook), TikTok, YouTube Shorts, Shop-Seiten, Landingpages und Brand-Channels.' },
  { id: '4', question: 'Macht ihr auch laufenden Content?', answer: 'Ja, mit dem Brand-Suite-Paket übernehmen wir die kontinuierliche Produktion neuer Creatives.' },
  { id: '5', question: 'Was kostet ein Video?', answer: 'Einstiegspreise findest du in unseren Paketen. Den finalen Preis nennen wir nach einem kurzen Briefing.' },
]

export function FAQ() {
  const items = useCmsList<Row>('faq_items', FALLBACK)
  return (
    <section className="relative py-28 sm:py-32 bg-background border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeUp className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-5">
            Häufige Fragen.
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            Antworten auf die Fragen, die wir am häufigsten hören.
          </p>
        </FadeUp>

        <FadeUp className="max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, i) => (
              <AccordionItem key={item.id} value={`item-${i}`}
                className="bg-card border border-white/[0.06] rounded-xl px-5 data-[state=open]:border-[#C9963B]/40 gentle-animation">
                <AccordionTrigger className="text-left text-foreground font-semibold hover:text-[#C9963B] hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#A8A29E] leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </section>
  )
}
