'use client'
import { FadeUp } from './FadeUp'
import { Icon } from '@/lib/icon'
import { useCmsList } from '@/hooks/useCms'

type Row = { id: string; icon_name: string | null; title: string; tagline: string | null; description: string | null }

const FALLBACK: Row[] = [
  { id: '1', icon_name: 'Film', title: 'Produktvideos', tagline: 'Hochwertig in Szene gesetzt', description: 'Kinoreife Produktvideos für Shops, Landingpages und Markenauftritte.' },
  { id: '2', icon_name: 'Megaphone', title: 'Social Ads', tagline: 'Performance-Creatives', description: 'Hook-getriebene Video-Ads für Meta, TikTok und YouTube.' },
  { id: '3', icon_name: 'Layers', title: 'Launch Creatives', tagline: 'Für Produkt-Launches', description: 'Kampagnen-Creatives mit mehreren Hooks und Formaten für A/B-Tests.' },
  { id: '4', icon_name: 'Smartphone', title: 'SaaS & App Videos', tagline: 'Digitale Produkte sichtbar machen', description: 'Erklär- und Promo-Videos für Apps, Tools und Software.' },
  { id: '5', icon_name: 'ShoppingBag', title: 'E-Commerce Reels', tagline: 'Conversion im Fokus', description: 'Short-Form-Videos für Produktseiten, Shops und Marken-Feeds.' },
  { id: '6', icon_name: 'Package', title: 'Content Pakete', tagline: 'Kontinuierlicher Output', description: 'Monatliche Pakete für Marken, die regelmäßig neuen Video-Content brauchen.' },
]

export function Services() {
  const items = useCmsList<Row>('services', FALLBACK)
  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeUp className="max-w-3xl mb-16">
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
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl">
          {items.map((s, i) => (
            <FadeUp key={s.id} delay={i * 0.05}>
              <div className="group h-full bg-[#141414] border border-white/[0.06] rounded-2xl p-8 hover:border-[#C9963B]/40 gentle-animation hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon name={s.icon_name} className="w-6 h-6 text-[#C9963B]" />
                </div>
                <h3 className="text-xl font-bold text-[#F4F0E8] mb-1">{s.title}</h3>
                {s.tagline && <p className="text-[#C9963B]/90 text-sm font-medium mb-3">{s.tagline}</p>}
                {s.description && <p className="text-[#A8A29E] text-sm leading-relaxed">{s.description}</p>}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
