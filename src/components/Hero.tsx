'use client'

import { motion } from 'framer-motion'
import { Volume2, VolumeX, Menu, X, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useSettings, setting } from '@/hooks/useCms'

const NAV = [
  { href: '#services', label: 'Leistungen' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process', label: 'Prozess' },
  { href: '#why', label: 'Warum' },
  { href: '#pricing', label: 'Preise' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Kontakt' },
]

const FALLBACK_VIDEO = 'https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm'

export function Hero() {
  const s = useSettings()
  const videoUrl = setting<string>(s, 'hero_video_url', FALLBACK_VIDEO)
  const posterUrl = setting<string>(s, 'hero_poster_url', '')
  const posterMobile = setting<string>(s, 'hero_poster_mobile_url', '')
  const badge = setting<string>(s, 'hero_badge', 'Ad Studio für Produktvideos & Social Ads')
  const headline = setting<string>(s, 'hero_headline', 'Dein Produkt. Kinoreif in Szene gesetzt.')
  const sublineDesktop = setting<string>(s, 'hero_subline', 'Sende uns Produktbilder, vorhandenes Material oder einen Produktlink. Wir entwickeln daraus hochwertige Produktvideos und Social Ads für Shops, Landingpages und Kampagnen.')
  const sublineMobile = setting<string>(s, 'hero_subline_mobile', 'Produktbilder, Material oder ein Produktlink reichen. Wir machen daraus Videos und Social Ads für Shop, Landingpage und Kampagnen.')
  const secondary = setting<string>(s, 'hero_secondary_line', 'Für Marken, Shops, digitale Produkte und Unternehmen, die online sichtbar werden wollen.')
  const bullets = setting<string[]>(s, 'hero_bullets', [
    'Produktbilder oder Produktlink reichen aus',
    'Für digitale & physische Produkte',
    'Formate für Meta, TikTok, YouTube & Shop',
    'Konzept, Produktion & Lieferung aus einer Hand',
  ])
  const mobileBullets = bullets.slice(0, 2)
  const primaryCta = setting<string>(s, 'primary_cta_label', 'Projekt anfragen')
  const secondaryCta = setting<string>(s, 'secondary_cta_label', 'Portfolio ansehen')

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  const effectivePoster = (isMobile ? (posterMobile || posterUrl) : posterUrl) || undefined

  const [isMuted, setIsMuted] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = isMuted
    v.volume = isMuted ? 0 : 0.7
  }, [isMuted])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  const goContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  // Highlight specific words in subline
  const highlightWords = ['Produktbilder', 'Produktlink', 'Produktvideos', 'Social Ads', 'Shops', 'Landingpages']
  const renderHighlighted = (text: string) => {
    const re = new RegExp(`(${highlightWords.join('|')})`, 'g')
    return text.split(re).map((part, i) =>
      highlightWords.includes(part)
        ? <span key={i} className="text-highlight font-semibold">{part}</span>
        : <span key={i}>{part}</span>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black film-grain">
      <video
        ref={videoRef}
        key={videoUrl}
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay muted loop playsInline preload="metadata"
        poster={posterUrl || undefined}
        aria-label="Hintergrundvideo: kinoreife Produktaufnahmen"
      >
        <source src={videoUrl} />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/95 sm:from-black/70 sm:via-black/50 sm:to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent sm:from-black/60 sm:via-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-black/25 sm:bg-transparent pointer-events-none" />

      <motion.nav
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-[110]"
      >
        <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ${
          isScrolled ? 'bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
        }`}>
          <div className="flex items-center justify-between">
            <a href="#hero" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-brand text-[#F4F0E8] text-2xl tracking-wide cursor-pointer">
              Soul Cinema
            </a>

            <div className="hidden lg:flex items-center gap-7">
              {NAV.map(n => (
                <a key={n.href} href={n.href} className="text-[#F4F0E8]/80 hover:text-[#C9963B] text-sm font-medium gentle-animation">
                  {n.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Ton aktivieren' : 'Ton stummschalten'}
                className="glass-effect p-2.5 rounded-full text-[#F4F0E8] hover:text-[#C9963B] gentle-animation">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={goContact}
                className="hidden sm:inline-flex bg-[#C9963B] text-[#0A0A0A] font-semibold px-5 py-2.5 rounded-md hover:bg-[#d9a64b] gentle-animation">
                {primaryCta}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menü"
                className="lg:hidden glass-effect p-2.5 rounded-full text-[#F4F0E8] z-[120] relative">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[80]" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <motion.div initial={false} animate={{ x: isMobileMenuOpen ? '0%' : '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-[#0A0A0A]/95 backdrop-blur-xl border-l border-white/10 z-[90]">
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
            {primaryCta}
          </button>
        </div>
      </motion.div>

      <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-8 lg:px-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="inline-flex items-center gap-2 self-start glass-effect rounded-full px-4 py-2 mb-6">
          <span className="w-1.5 h-1.5 bg-[#C9963B] rounded-full" />
          <span className="text-[#F4F0E8]/90 text-xs sm:text-sm font-medium tracking-wide">{badge}</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}
          className="font-brand text-[2.5rem] leading-[1.1] sm:text-5xl sm:leading-[1.05] lg:text-7xl text-[#F4F0E8] tracking-tight mb-6 max-w-4xl">
          {headline.split(/(Produkt|Kinoreif)/g).map((part, i) =>
            (part === 'Produkt' || part === 'Kinoreif')
              ? <span key={i} className="text-highlight">{part}</span>
              : <span key={i}>{part}</span>
          )}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75 }}
          className="text-base sm:text-lg lg:text-xl text-[#F4F0E8]/85 max-w-2xl mb-3 leading-relaxed">
          {renderHighlighted(subline)}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.9 }}
          className="text-sm sm:text-base text-[#A8A29E] max-w-2xl mb-8">
          {secondary}
        </motion.p>

        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[#F4F0E8]/85 text-sm mb-8 max-w-2xl">
          {bullets.map(b => (
            <li key={b} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C9963B] mt-0.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.2 }}
          className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full sm:w-auto max-w-sm sm:max-w-none">
          <button onClick={goContact} className="w-full sm:w-auto bg-[#C9963B] text-[#0A0A0A] font-semibold px-7 py-4 sm:py-3.5 rounded-md hover:bg-[#d9a64b] gentle-animation min-h-12">
            {primaryCta}
          </button>
          <a href="#portfolio" className="w-full sm:w-auto text-center text-[#F4F0E8]/85 sm:glass-effect sm:text-[#F4F0E8] font-medium sm:font-semibold px-7 py-3 sm:py-3.5 rounded-md hover:text-[#C9963B] gentle-animation min-h-12 flex items-center justify-center underline-offset-4 underline sm:no-underline">
            {secondaryCta}
          </a>
        </motion.div>
      </div>
    </div>
  )
}
