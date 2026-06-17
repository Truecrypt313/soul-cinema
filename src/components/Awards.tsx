'use client'

import { Search, Target, Zap, Smartphone, Layers, PackageCheck } from 'lucide-react'

const REASONS = [
  { icon: Search, title: 'Produktverständnis', text: 'Wir analysieren Produkt, Zielgruppe und Plattform, bevor ein Creative entsteht.' },
  { icon: Target, title: 'Ad-orientierte Konzepte', text: 'Jedes Video wird mit Hook, Format und Einsatzkanal entwickelt.' },
  { icon: Zap, title: 'Schneller Start', text: 'Produktbilder, vorhandenes Material oder ein Produktlink reichen für die erste Einschätzung aus.' },
  { icon: Smartphone, title: 'Für Social Media gemacht', text: 'Videos werden für mobile Formate, kurze Aufmerksamkeitsspannen und klare Botschaften entwickelt.' },
  { icon: Layers, title: 'Mehrere Varianten möglich', text: 'Auf Wunsch entstehen verschiedene Hooks, Formate und Versionen für Kampagnen und Tests.' },
  { icon: PackageCheck, title: 'Klare Lieferung', text: 'Sie erhalten fertige Dateien für Social Media, Ads, Landingpages oder Shops.' },
]

export function Awards() {
  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Warum Soul Cinema</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] leading-tight tracking-tight mb-5">
            Warum Soul Cinema?
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            Wir verbinden <span className="text-highlight">Produktverständnis</span>, <span className="text-highlight">kreative Konzepte</span> und moderne Produktion zu <span className="text-highlight">Werbevideos</span>, die online funktionieren.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="group bg-[#141414] border border-white/[0.06] rounded-2xl p-7 hover:border-[#C9963B]/40 gentle-animation hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-lg bg-accent-soft flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <r.icon className="w-5 h-5 text-[#C9963B]" />
              </div>
              <h3 className="text-lg font-bold text-[#F4F0E8] mb-2">{r.title}</h3>
              <p className="text-[#A8A29E] text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
