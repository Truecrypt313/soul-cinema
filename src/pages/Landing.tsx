import { useEffect } from 'react'
import { Hero } from '@/components/Hero'
import { CreativePromptSection } from '@/components/CreativePromptSection'
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
import { StickyMobileCta } from '@/components/StickyMobileCta'
import { useSettings, setting } from '@/hooks/useCms'
import { trackPageView, observeSectionViews } from '@/lib/analytics'

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
  const s = useSettings()
  const title = setting<string>(s, 'seo_title', 'Soul Cinema — Produktvideos, Werbevideos & Social Ads')
  const description = setting<string>(s, 'seo_description', 'Soul Cinema ist ein Ad Studio für Produktvideos, Werbevideos und Social Ads – für digitale und physische Produkte. Konzept, Produktion & Lieferung aus einer Hand.')
  const ogTitle = setting<string>(s, 'og_title', title)
  const ogDescription = setting<string>(s, 'og_description', description)
  const ogImage = setting<string>(s, 'og_image_url', 'https://soulcinema.de/og-image.jpg')
  useEffect(() => {
    trackPageView()
    // start after first paint so initial section doesn't trigger before user really sees it
    const t = window.setTimeout(() => {
      const stop = observeSectionViews()
      ;(window as any).__sc_stop_obs = stop
    }, 300)
    return () => {
      clearTimeout(t)
      const stop = (window as any).__sc_stop_obs
      if (typeof stop === 'function') stop()
    }
  }, [])
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={title}
        description={description}
        path="/"
        image={ogImage}
        ogTitle={ogTitle}
        ogDescription={ogDescription}
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
      <StickyMobileCta />
    </div>
  )
}
