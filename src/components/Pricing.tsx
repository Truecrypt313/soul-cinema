'use client'
import { Check } from 'lucide-react'
import { FadeUp } from './FadeUp'
import { useCmsList } from '@/hooks/useCms'

type Row = { id: string; name: string; price_label: string; description: string | null; features: string[]; cta_label: string | null; highlighted: boolean }

const FALLBACK: Row[] = [
  { id: '1', name: 'Starter', price_label: 'ab 790 €', description: 'Erstes Produktvideo oder Social Ad', features: ['1 Produktvideo / Ad','Hook & Konzept','Lieferung als MP4','1 Korrekturschleife'], cta_label: 'Projekt anfragen', highlighted: false },
  { id: '2', name: 'Professional', price_label: 'ab 1.890 €', description: 'Kampagnen-Paket mit mehreren Varianten', features: ['3 Video-Varianten','Mehrere Hooks','Plattform-Cuts (9:16, 1:1, 16:9)','2 Korrekturschleifen','Sounddesign & Musik'], cta_label: 'Projekt anfragen', highlighted: true },
  { id: '3', name: 'Brand Suite', price_label: 'auf Anfrage', description: 'Laufender Content für Marken', features: ['Monatliche Produktion','Content-Strategie','Skalierbare Hooks','Priority Support','Eigener Ansprechpartner'], cta_label: 'Gespräch anfragen', highlighted: false },
]

export function Pricing() {
  const pkgs = useCmsList<Row>('pricing_packages', FALLBACK)
  return (
    <section className="relative py-28 sm:py-32 bg-background border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeUp className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Preise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-5">
            Transparente <span className="text-highlight">Einstiegspakete</span>.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Der finale Preis richtet sich nach Umfang, Materiallage, Anzahl der Varianten und gewünschten Formaten.
          </p>
        </FadeUp>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${pkgs.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-5 max-w-7xl`}>
          {pkgs.map((p, i) => {
            const features = Array.isArray(p.features) ? p.features : []
            return (
              <FadeUp key={p.id} delay={i * 0.07} className="h-full">
                <div className={`relative h-full rounded-2xl p-8 gentle-animation ${
                  p.highlighted
                    ? 'bg-gradient-to-b from-[#1c1814] to-[#141414] border border-[#C9963B]/40 elevated-shadow'
                    : 'bg-card border border-white/[0.06] hover:border-[#C9963B]/30'
                }`}>
                  {p.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9963B] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full">Beliebt</span>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-1">{p.name}</h3>
                  <div className="text-3xl font-black text-[#C9963B] mb-3 tracking-tight">{p.price_label}</div>
                  {p.description && <p className="text-sm text-[#A8A29E] mb-6 leading-relaxed">{p.description}</p>}
                  <ul className="space-y-3 mb-8">
                    {features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/85">
                        <Check className="w-4 h-4 text-[#C9963B] mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className={`block text-center w-full font-semibold py-3 rounded-md gentle-animation ${
                    p.highlighted ? 'bg-[#C9963B] text-[#0A0A0A] hover:bg-[#d9a64b]' : 'border border-[#C9963B]/40 text-foreground hover:bg-[#C9963B]/10 hover:text-[#C9963B]'
                  }`}>
                    {p.cta_label || 'Projekt anfragen'}
                  </a>
                </div>
              </FadeUp>
            )
          })}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          Alle Preise sind Einstiegspreise und werden nach Briefing final kalkuliert.
        </p>
      </div>
    </section>
  )
}
