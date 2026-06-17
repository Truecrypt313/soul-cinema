'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const QA = [
  { q: 'Was kostet ein Produktvideo?', a: 'Die Kosten hängen von Umfang, Materiallage, Länge, Formaten und Varianten ab. Einstiegspakete beginnen ab 790 €.' },
  { q: 'Wie lange dauert die Produktion?', a: 'Das hängt vom Projektumfang ab. Nach der Anfrage geben wir eine realistische Einschätzung zu Ablauf und Timing.' },
  { q: 'Welche Formate liefert ihr?', a: 'Typische Formate sind 9:16 für Reels, TikTok und Shorts, 1:1 für Feeds und 16:9 für Websites oder YouTube.' },
  { q: 'Brauche ich eigenes Videomaterial?', a: 'Nicht zwingend. Produktbilder, vorhandenes Material oder ein Produktlink reichen oft für die erste Einschätzung aus.' },
  { q: 'Macht ihr auch UGC-Style Content?', a: 'Ja, je nach Produkt und Ziel können wir UGC-inspirierte Creatives, Produktdemos oder Ad-Varianten entwickeln.' },
  { q: 'Wie läuft die Zusammenarbeit ab?', a: 'Sie senden uns Produktinfos oder einen Link. Wir prüfen Produkt, Zielgruppe und Zielkanal, entwickeln ein Konzept und liefern die fertigen Videos in passenden Formaten.' },
]

export function FAQ() {
  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] leading-tight tracking-tight mb-5">
            Häufige Fragen.
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            Antworten auf die Fragen, die wir am häufigsten hören.
          </p>
        </div>

        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {QA.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-[#141414] border border-white/[0.06] rounded-xl px-5 data-[state=open]:border-[#C9963B]/40 gentle-animation"
              >
                <AccordionTrigger className="text-left text-[#F4F0E8] font-semibold hover:text-[#C9963B] hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#A8A29E] leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
