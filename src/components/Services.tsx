'use client'

import { Film, Megaphone, Sparkles, ShoppingBag, Monitor, Layers } from 'lucide-react'

const SERVICES = [
  {
    icon: Film,
    title: 'Produktvideos',
    tagline: 'Zeig, was dein Produkt kann.',
    description: 'Hochwertige Videos für physische und digitale Produkte – ideal für Shops, Landingpages und Kampagnen.',
  },
  {
    icon: Megaphone,
    title: 'Social Ads',
    tagline: 'Creatives, die Aufmerksamkeit stoppen.',
    description: 'Kurze, starke Video-Ads für TikTok, Instagram Reels, YouTube Shorts und Meta Ads.',
  },
  {
    icon: Sparkles,
    title: 'Werbevideos',
    tagline: 'Markenstark. Klar. Visuell hochwertig.',
    description: 'Videos für Produktlaunches, Angebote und Kampagnen, die professionell wirken sollen.',
  },
  {
    icon: ShoppingBag,
    title: 'E-Commerce Videos',
    tagline: 'Mehr Conversion im Shop.',
    description: 'Produktvideos für Online-Shops, Amazon, Shopify und D2C Brands.',
  },
  {
    icon: Monitor,
    title: 'SaaS & App Videos',
    tagline: 'Digitale Produkte sichtbar machen.',
    description: 'Videos, die Apps, SaaS oder Features verständlich und visuell stark präsentieren.',
  },
  {
    icon: Layers,
    title: 'Content Packages',
    tagline: 'Mehrere Varianten für Tests & Kampagnen.',
    description: 'Hooks, Formate und Versionen für Paid Ads, Kampagnen und regelmäßigen Content.',
  },
]

export function Services() {
  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Leistungen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] leading-tight tracking-tight mb-5">
            Videos für <span className="text-highlight">Produkte</span>, <span className="text-highlight">Ads</span> und <span className="text-highlight">Online-Kampagnen</span>.
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            Für Unternehmen, die ihre Produkte hochwertig präsentieren und online mehr <span className="text-highlight">Aufmerksamkeit</span> erzeugen möchten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group relative bg-[#141414] border border-white/[0.06] rounded-2xl p-8 hover:border-[#C9963B]/40 gentle-animation hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="w-6 h-6 text-[#C9963B]" />
              </div>
              <h3 className="text-xl font-bold text-[#F4F0E8] mb-1">{s.title}</h3>
              <p className="text-[#C9963B]/90 text-sm font-medium mb-3">{s.tagline}</p>
              <p className="text-[#A8A29E] text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
