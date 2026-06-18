import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { Portfolio } from '@/components/Portfolio'
import { About } from '@/components/About'
import { Awards } from '@/components/Awards'
import { Pricing } from '@/components/Pricing'
import { Testimonials } from '@/components/Testimonials'
import { FAQ } from '@/components/FAQ'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { Seo } from '@/components/Seo'

const FAQS = [
  { q: 'Was brauche ich für ein Projekt?', a: 'Produktbilder, vorhandenes Material oder ein Produktlink reichen für eine erste Einschätzung. Alles weitere klären wir gemeinsam.' },
  { q: 'Wie lange dauert ein Video?', a: 'Ein einzelnes Video typischerweise 1–2 Wochen, Kampagnen-Pakete entsprechend länger.' },
  { q: 'Für welche Plattformen produziert ihr?', a: 'Meta (Instagram, Facebook), TikTok, YouTube Shorts, Shop-Seiten, Landingpages und Brand-Channels.' },
  { q: 'Macht ihr auch laufenden Content?', a: 'Ja, mit dem Brand-Suite-Paket übernehmen wir die kontinuierliche Produktion neuer Creatives.' },
  { q: 'Was kostet ein Video?', a: 'Einstiegspreise findest du in unseren Paketen. Den finalen Preis nennen wir nach einem kurzen Briefing.' },
]

const SERVICES = [
  { name: 'Produktvideos', description: 'Kinoreife Produktvideos für Shops, Landingpages und Markenauftritte.' },
  { name: 'Social Ads', description: 'Hook-getriebene Video-Ads für Meta, TikTok und YouTube.' },
  { name: 'Launch Creatives', description: 'Kampagnen-Creatives mit mehreren Hooks und Formaten für A/B-Tests.' },
  { name: 'SaaS & App Videos', description: 'Erklär- und Promo-Videos für Apps, Tools und Software.' },
  { name: 'E-Commerce Reels', description: 'Short-Form-Videos für Produktseiten, Shops und Marken-Feeds.' },
  { name: 'Content Pakete', description: 'Monatliche Pakete für Marken, die regelmäßig neuen Video-Content brauchen.' },
]

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Videoproduktion und Social Ads',
  provider: { '@type': 'Organization', name: 'Soul Cinema', url: 'https://soulcinema.de' },
  areaServed: 'DE',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Leistungen',
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, description: s.description },
    })),
  },
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F0E8]">
      <Seo
        title="Soul Cinema — Produktvideos, Werbevideos & Social Ads"
        description="Soul Cinema ist ein Ad Studio für Produktvideos, Werbevideos und Social Ads – für digitale und physische Produkte. Konzept, Produktion & Lieferung aus einer Hand."
        path="/"
        jsonLd={[faqLd, serviceLd]}
      />
      <main className="relative" role="main">
        <section id="hero" aria-label="Hero"><Hero /></section>
        <section id="services" aria-label="Leistungen"><Services /></section>
        <section id="portfolio" aria-label="Portfolio"><Portfolio /></section>
        <section id="process" aria-label="Prozess"><About /></section>
        <section id="why" aria-label="Warum Soul Cinema"><Awards /></section>
        <section id="pricing" aria-label="Preise"><Pricing /></section>
        <Testimonials />
        <section id="faq" aria-label="FAQ"><FAQ /></section>
        <section id="contact" aria-label="Kontakt"><Contact /></section>
      </main>
      <Footer />
    </div>
  )
}
