import { Hero } from '@/components/Hero'
import { Portfolio } from '@/components/Portfolio'
import { Awards } from '@/components/Awards'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { Team } from '@/components/Team'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ overflow: 'visible' }}>
      <main className="relative" role="main" style={{ overflow: 'visible' }}>
        <section id="hero" aria-label="Hero"><Hero /></section>
        <section id="portfolio" aria-label="Arbeiten"><Portfolio /></section>
        <section id="why" aria-label="Warum Soul Cinema"><Awards /></section>
        <section id="about" aria-label="Prozess"><About /></section>
        <section id="services" aria-label="Leistungen"><Services /></section>
        <section id="audience" aria-label="Für wen" style={{ overflow: 'visible' }}><Team /></section>
        <section id="contact" aria-label="Anfrage"><Contact /></section>
      </main>
      <Footer />
    </div>
  )
}
