'use client'

import { useEffect, useState } from 'react'
import { Film, Megaphone, ShoppingBag, Monitor, Rocket, Layers } from 'lucide-react'

const SERVICES = [
  {
    icon: Film,
    title: 'Produktvideos',
    description: 'Hochwertige Videos für physische und digitale Produkte – ideal für Shops, Ads und Landingpages.',
  },
  {
    icon: Megaphone,
    title: 'Social-Media-Ads',
    description: 'Kurze, aufmerksamkeitsstarke Creatives für TikTok, Instagram Reels, YouTube Shorts und Meta Ads.',
  },
  {
    icon: ShoppingBag,
    title: 'E-Commerce Videos',
    description: 'Produktvideos für Online-Shops, Amazon, Shopify und D2C Brands.',
  },
  {
    icon: Monitor,
    title: 'SaaS & App Videos',
    description: 'Visuelle Videos, die digitale Produkte, Apps oder Features einfach verständlich darstellen.',
  },
  {
    icon: Rocket,
    title: 'Launch Creatives',
    description: 'Video-Assets für Produktlaunches, neue Angebote und Kampagnenstarts.',
  },
  {
    icon: Layers,
    title: 'Content Packages',
    description: 'Mehrere Video-Varianten, Hooks und Formate für Tests, Kampagnen und regelmäßigen Content.',
  },
]

export function Services() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)',
      }}
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 mb-6 transform transition-all duration-1000 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-white/70">Leistungen</span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>

          <h2 className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 text-white transform transition-all duration-1000 delay-200 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            Videos für Produkte, Kampagnen und Social Media.
          </h2>

          <p className={`text-xl text-white/70 leading-relaxed max-w-3xl mx-auto transform transition-all duration-1000 delay-400 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Für Unternehmen, die Produkte hochwertig präsentieren und online stärker sichtbar machen möchten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/20 gentle-animation hover:-translate-y-1 transform transition-all duration-700 ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 100 + 600}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">{s.title}</h3>
              <p className="text-white/70 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
