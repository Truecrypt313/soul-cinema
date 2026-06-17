'use client'

import { Check } from 'lucide-react'

const PACKAGES = [
  {
    name: 'Starter',
    price: 'ab 790 €',
    description: 'Für erste Produktvideos und einzelne Creatives.',
    features: ['1 Produktvideo', 'bis ca. 30 Sekunden', '1 Format, z. B. 9:16', 'Einfache Text-/Sound-Anpassung'],
    cta: 'Starter anfragen',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 'ab 1.490 €',
    description: 'Für Social Ads, Varianten und Kampagnentests.',
    features: ['Bis zu 3 Video-Varianten', '2 Formate, z. B. 9:16 und 1:1', 'Hook-Varianten', 'Geeignet für Paid Ads'],
    cta: 'Professional anfragen',
    highlighted: true,
  },
  {
    name: 'Brand Suite',
    price: 'auf Anfrage',
    description: 'Für Launches, Kampagnen und wiederkehrende Inhalte.',
    features: ['Creative-Konzept', 'Mehrere Video-Assets', 'Verschiedene Formate', 'Kampagnen-Setups & Content-Pakete'],
    cta: 'Beratung anfragen',
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Preise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] leading-tight tracking-tight mb-5">
            Pakete für unterschiedliche Ziele.
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            Vom einzelnen <span className="text-highlight">Produktvideo</span> bis zum Creative-Paket für Kampagnen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl">
          {PACKAGES.map(p => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-8 gentle-animation ${
                p.highlighted
                  ? 'bg-gradient-to-b from-[#1c1814] to-[#141414] border border-[#C9963B]/40 elevated-shadow'
                  : 'bg-[#141414] border border-white/[0.06] hover:border-[#C9963B]/30'
              }`}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9963B] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full">
                  Beliebt
                </span>
              )}
              <h3 className="text-xl font-bold text-[#F4F0E8] mb-1">{p.name}</h3>
              <div className="text-3xl font-black text-[#C9963B] mb-3 tracking-tight">{p.price}</div>
              <p className="text-sm text-[#A8A29E] mb-6 leading-relaxed">{p.description}</p>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#F4F0E8]/85">
                    <Check className="w-4 h-4 text-[#C9963B] mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`block text-center w-full font-semibold py-3 rounded-md gentle-animation ${
                  p.highlighted
                    ? 'bg-[#C9963B] text-[#0A0A0A] hover:bg-[#d9a64b]'
                    : 'border border-[#C9963B]/40 text-[#F4F0E8] hover:bg-[#C9963B]/10 hover:text-[#C9963B]'
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-[#A8A29E] max-w-2xl mx-auto">
          Alle Preise verstehen sich als Einstiegspreise und richten sich nach Umfang, Materiallage und gewünschter Anzahl an Varianten.
        </p>
      </div>
    </section>
  )
}
