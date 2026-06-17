import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { Portfolio } from '@/components/Portfolio'
import { About } from '@/components/About'
import { Awards } from '@/components/Awards'
import { Pricing } from '@/components/Pricing'
import { Team } from '@/components/Team'
import { FAQ } from '@/components/FAQ'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F0E8]">
      <main className="relative" role="main">
        <section id="hero" aria-label="Hero"><Hero /></section>
        <section id="services" aria-label="Leistungen"><Services /></section>
        <section id="portfolio" aria-label="Portfolio"><Portfolio /></section>
        <section id="process" aria-label="Prozess"><About /></section>
        <section id="why" aria-label="Warum Soul Cinema"><Awards /></section>
        <section id="pricing" aria-label="Preise"><Pricing /></section>
        <section id="audience" aria-label="Was Kunden brauchen"><Team /></section>
        <section id="faq" aria-label="FAQ"><FAQ /></section>
        <section id="contact" aria-label="Kontakt"><Contact /></section>
      </main>
      <Footer />
    </div>
  )
}
