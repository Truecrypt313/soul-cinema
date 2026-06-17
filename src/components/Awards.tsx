'use client'

import { Zap, Wallet, Smartphone, Package } from 'lucide-react'

const REASONS = [
  {
    icon: Zap,
    title: 'Schneller Start',
    text: 'Produktbilder, vorhandenes Material oder ein Produktlink reichen für die erste Einschätzung aus.',
  },
  {
    icon: Wallet,
    title: 'Kosteneffizient',
    text: 'Professionelle Produktvideos ohne klassisches Studio-Setup, großes Team oder lange Drehtage.',
  },
  {
    icon: Smartphone,
    title: 'Social-Media-Fokus',
    text: 'Videos werden direkt für kurze Aufmerksamkeitsspannen, klare Hooks und mobile Formate gedacht.',
  },
  {
    icon: Package,
    title: 'Für viele Produktarten',
    text: 'Geeignet für physische Produkte, digitale Produkte, Apps, Software und Online-Angebote.',
  },
]

export function Awards() {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-purple rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">Vorteile</span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
            Warum Soul Cinema?
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Einfacher Prozess. Moderne Produktion. Starke Produktwirkung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="group bg-card/60 clean-border rounded-2xl p-8 subtle-shadow gentle-animation hover:elevated-shadow hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <r.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3">{r.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
