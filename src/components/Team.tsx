'use client'

import { TrendingUp, Sparkles, Camera, Layers } from 'lucide-react'

const NEEDS = [
  { icon: TrendingUp, title: 'Mehr Aufmerksamkeit', text: 'Mehr Aufmerksamkeit für ein bestimmtes Produkt.' },
  { icon: Sparkles, title: 'Bessere Ad Creatives', text: 'Stärkere Videos für Paid Ads und Social Media.' },
  { icon: Camera, title: 'Ohne aufwendigen Dreh', text: 'Professionelle Videos – auch ohne eigenes Filmteam.' },
  { icon: Layers, title: 'Inhalte für alle Kanäle', text: 'Material für Shop, Landingpage und Social Media.' },
]

export function Team() {
  return (
    <section className="relative py-28 sm:py-32 bg-background border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Was Kunden typischerweise brauchen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-5">
            Für Produkte, die online sichtbar werden sollen.
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            Soul Cinema arbeitet für <span className="text-highlight">Marken, Shops, Startups</span> und Unternehmen, die ihre Produkte professionell präsentieren möchten.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl">
          {NEEDS.map(n => (
            <div key={n.title} className="bg-card border border-white/[0.06] rounded-2xl p-6 hover:border-[#C9963B]/40 gentle-animation">
              <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center mb-4">
                <n.icon className="w-5 h-5 text-[#C9963B]" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{n.title}</h3>
              <p className="text-sm text-[#A8A29E] leading-relaxed">{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
