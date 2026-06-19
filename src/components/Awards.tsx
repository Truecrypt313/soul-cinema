'use client'
import { FadeUp } from './FadeUp'
import { Icon } from '@/lib/icon'
import { useCmsList } from '@/hooks/useCms'

type Reason = { id: string; icon_name: string | null; title: string; description: string | null }
type Audience = { id: string; icon_name: string | null; title: string; description: string | null }

const REASONS_FB: Reason[] = [
  { id: '1', icon_name: 'Zap', title: 'Produktlink reicht', description: 'Du brauchst kein fertiges Videomaterial. Ein Link, Bilder oder vorhandene Assets reichen oft für den Start.' },
  { id: '2', icon_name: 'Target', title: 'Ad-orientierte Konzepte', description: 'Jedes Creative wird mit Hook, Plattform und Einsatzkanal gedacht.' },
  { id: '3', icon_name: 'Sparkles', title: 'Keine generischen Templates', description: 'Videos werden auf Produkt, Zielgruppe und Wirkung zugeschnitten.' },
  { id: '4', icon_name: 'Layers', title: 'Mehrere Varianten möglich', description: 'Auf Wunsch entstehen verschiedene Hooks, Formate und Versionen für Kampagnen.' },
  { id: '5', icon_name: 'Smartphone', title: 'Für Social Media gemacht', description: 'Optimiert für mobile Formate, kurze Aufmerksamkeitsspannen und klare Botschaften.' },
  { id: '6', icon_name: 'PackageCheck', title: 'Klare Lieferung', description: 'Du erhältst fertige Dateien für Ads, Shop, Landingpage oder Website.' },
]
const AUDIENCE_FB: Audience[] = [
  { id: '1', icon_name: 'ShoppingCart', title: 'E-Commerce Shops', description: null },
  { id: '2', icon_name: 'Package', title: 'Physische Produkte', description: null },
  { id: '3', icon_name: 'Cloud', title: 'Digitale Produkte', description: null },
  { id: '4', icon_name: 'Smartphone', title: 'SaaS & Apps', description: null },
  { id: '5', icon_name: 'Rocket', title: 'Produktlaunches', description: null },
  { id: '6', icon_name: 'Megaphone', title: 'Social Ads', description: null },
  { id: '7', icon_name: 'Building2', title: 'Marken & Startups', description: null },
]

export function Awards() {
  const reasons = useCmsList<Reason>('reasons', REASONS_FB)
  const audience = useCmsList<Audience>('audience_items', AUDIENCE_FB)
  return (
    <section className="relative py-28 sm:py-32 bg-background border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeUp className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Warum Soul Cinema</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-5">
            Warum Soul Cinema?
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            Wir verbinden <span className="text-highlight">Produktverständnis</span>, kreative Konzepte und moderne Produktion zu <span className="text-highlight">Werbevideos</span>, die online funktionieren.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mb-20">
          {reasons.map((r, i) => (
            <FadeUp key={r.id} delay={i * 0.05}>
              <div className="group h-full bg-card border border-white/[0.06] rounded-2xl p-7 hover:border-[#C9963B]/40 gentle-animation hover:-translate-y-1">
                <div className="w-11 h-11 rounded-lg bg-accent-soft flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon name={r.icon_name} className="w-5 h-5 text-[#C9963B]" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{r.title}</h3>
                {r.description && <p className="text-[#A8A29E] text-sm leading-relaxed">{r.description}</p>}
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="max-w-3xl mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Für wen ist Soul Cinema geeignet?</h3>
          <p className="text-[#A8A29E]">Wir arbeiten mit Brands, Shops und Teams, die ihre Produkte online sichtbar machen wollen.</p>
        </FadeUp>
        <FadeUp className="flex flex-wrap gap-3 max-w-5xl">
          {audience.map(a => (
            <div key={a.id} className="inline-flex items-center gap-2 bg-card border border-white/[0.06] hover:border-[#C9963B]/40 rounded-full px-4 py-2.5 gentle-animation">
              <Icon name={a.icon_name} className="w-4 h-4 text-[#C9963B]" />
              <span className="text-sm text-foreground/90">{a.title}</span>
            </div>
          ))}
        </FadeUp>
      </div>
    </section>
  )
}
