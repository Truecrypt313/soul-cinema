'use client'

import { motion } from 'framer-motion'
import { Volume2, VolumeX, Menu, X, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const NAV = [
  { href: '#services', label: 'Leistungen' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process', label: 'Prozess' },
  { href: '#pricing', label: 'Preise' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Kontakt' },
]

export function Hero() {
  const [isMuted, setIsMuted] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
      videoRef.current.volume = isMuted ? 0 : 0.7
    }
  }, [isMuted])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  const goContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black film-grain">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay muted loop playsInline
      >
        <source src="https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm" type="video/webm" />
      </video>

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-[110]"
      >
        <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ${
          isScrolled ? 'bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
        }`}>
          <div className="flex items-center justify-between">
            <a href="#hero" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-bagel text-[#F4F0E8] text-xl tracking-wider cursor-pointer">
              Soul Cinema
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {NAV.map(n => (
                <a key={n.href} href={n.href} className="text-[#F4F0E8]/80 hover:text-[#C9963B] text-sm font-medium gentle-animation">
                  {n.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? 'Ton aktivieren' : 'Ton stummschalten'}
                className="glass-effect p-2.5 rounded-full text-[#F4F0E8] hover:text-[#C9963B] gentle-animation"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={goContact}
                className="hidden sm:inline-flex bg-[#C9963B] text-[#0A0A0A] font-semibold px-5 py-2.5 rounded-md hover:bg-[#d9a64b] gentle-animation"
              >
                Projekt anfragen
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menü"
                className="lg:hidden glass-effect p-2.5 rounded-full text-[#F4F0E8] z-[120] relative"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[80]" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <motion.div
        initial={false}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-[#0A0A0A]/95 backdrop-blur-xl border-l border-white/10 z-[90]"
      >
        <div className="flex flex-col h-full p-6 pt-24">
          <div className="flex flex-col space-y-2">
            {NAV.map(n => (
              <a key={n.href} href={n.href} onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 hover:bg-white/5 hover:text-[#C9963B] rounded-lg text-[#F4F0E8] font-medium">
                {n.label}
              </a>
            ))}
          </div>
          <button onClick={goContact} className="mt-6 bg-[#C9963B] text-[#0A0A0A] font-semibold px-6 py-3 rounded-md">
            Projekt anfragen
          </button>
        </div>
      </motion.div>

      {/* Hero content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-8 lg:px-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="inline-flex items-center gap-2 self-start glass-effect rounded-full px-4 py-2 mb-6"
        >
          <span className="w-1.5 h-1.5 bg-[#C9963B] rounded-full" />
          <span className="text-[#F4F0E8]/90 text-xs sm:text-sm font-medium tracking-wide">Ad Studio für Produktvideos & Social Ads</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#F4F0E8] leading-[1.05] tracking-tight mb-6 max-w-4xl"
        >
          Dein <span className="text-highlight">Produkt</span>. <br className="hidden sm:block" />
          <span className="text-highlight">Kinoreif</span> in Szene gesetzt.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75 }}
          className="text-base sm:text-lg lg:text-xl text-[#F4F0E8]/80 max-w-2xl mb-3 leading-relaxed"
        >
          Wir entwickeln <span className="text-highlight font-semibold">Produktvideos</span> und <span className="text-highlight font-semibold">Social Ads</span> für digitale und physische Produkte – aus <span className="text-highlight font-semibold">Produktbildern</span>, vorhandenem Material oder einem <span className="text-highlight font-semibold">Produktlink</span>.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.9 }}
          className="text-sm sm:text-base text-[#A8A29E] max-w-2xl mb-8"
        >
          Für Shops, Brands, digitale Produkte und Kampagnen, die online sichtbar werden sollen.
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[#F4F0E8]/85 text-sm mb-8 max-w-2xl"
        >
          {[
            'Produktbilder oder Produktlink reichen aus',
            'Für digitale & physische Produkte',
            'Für Social Ads, Shops & Landingpages',
            'Konzept, Produktion & Lieferung aus einer Hand',
          ].map(b => (
            <li key={b} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C9963B] mt-0.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.2 }}
          className="flex flex-wrap gap-3"
        >
          <button onClick={goContact} className="bg-[#C9963B] text-[#0A0A0A] font-semibold px-7 py-3.5 rounded-md hover:bg-[#d9a64b] gentle-animation">
            Projekt anfragen
          </button>
          <a href="#portfolio" className="glass-effect text-[#F4F0E8] font-semibold px-7 py-3.5 rounded-md hover:text-[#C9963B] gentle-animation">
            Portfolio ansehen
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
          className="mt-10 text-xs text-[#A8A29E] tracking-widest uppercase"
        >
          Für Marken, Shops und digitale Produkte
        </motion.div>
      </div>
    </div>
  )
}
