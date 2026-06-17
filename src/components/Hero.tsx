'use client'

import { motion } from 'framer-motion'
import { Volume2, VolumeX, Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const NAV = [
  { href: '#portfolio', label: 'Arbeiten' },
  { href: '#about', label: 'Prozess' },
  { href: '#services', label: 'Leistungen' },
  { href: '#contact', label: 'Anfrage' },
]

export function Hero() {
  const [isMuted, setIsMuted] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0
      videoRef.current.muted = true
      videoRef.current.defaultMuted = true
      const p = videoRef.current.play()
      if (p) p.catch(() => {})
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
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm" type="video/webm" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 pointer-events-none" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 w-full z-[110]"
      >
        <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ease-out ${
          isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}>
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="font-bagel text-white text-xl tracking-wider">Soul Cinema</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {NAV.map(n => (
                <a key={n.href} href={n.href} className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105">
                  {n.label}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-3 relative">
              <div className="relative">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Ton aktivieren' : 'Ton stummschalten'}
                  className="glass-effect p-3 rounded-full text-white hover:bg-white/20 gentle-animation cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                {isMuted && (
                  <div className="absolute -bottom-10 right-0 flex items-center text-white/80">
                    <span className="whitespace-nowrap font-medium text-sm mr-2">Ton aktivieren</span>
                    <span className="text-lg">↗</span>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goContact}
                className="hidden sm:block bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-white/90 gentle-animation ml-4 cursor-pointer"
              >
                Projekt anfragen
              </motion.button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menü"
                className="md:hidden glass-effect p-3 rounded-full text-white hover:bg-white/20 gentle-animation cursor-pointer z-[120] relative"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[80]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <motion.div
        initial={false}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-black/95 backdrop-blur-xl border-l border-white/10 z-[90]"
      >
        <div className="flex flex-col h-full p-6 pt-20">
          <div className="flex flex-col space-y-3 text-white">
            {NAV.map(n => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 hover:bg-white/10 rounded-lg font-medium text-lg"
              >
                {n.label}
              </a>
            ))}
          </div>
          <button
            onClick={goContact}
            className="bg-white text-black font-semibold px-6 py-3 rounded-lg mt-8"
          >
            Projekt anfragen
          </button>
        </div>
      </motion.div>

      {/* Hero content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-8 lg:px-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="inline-flex items-center gap-2 self-start glass-effect rounded-full px-4 py-2 mb-6"
        >
          <span className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
          <span className="text-white/90 text-sm font-medium">Product Video & Social Ad Studio</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-6 max-w-4xl"
        >
          Produktvideos, die Aufmerksamkeit erzeugen.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-lg sm:text-xl text-white/80 max-w-2xl mb-8"
        >
          Soul Cinema entwickelt und produziert hochwertige Werbevideos für digitale und physische Produkte – für Social Media, Paid Ads, Shops und Landingpages.
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-wrap gap-x-6 gap-y-2 text-white/80 text-sm mb-8"
        >
          {['Für physische & digitale Produkte', 'Produktbilder oder Produktlink reichen aus', 'Für Social Ads, Shops & Landingpages', 'Konzept, Produktion & Ad Creatives aus einer Hand'].map(b => (
            <li key={b} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
              {b}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex flex-wrap gap-3"
        >
          <button
            onClick={goContact}
            className="bg-white text-black font-semibold px-7 py-4 rounded-md hover:bg-white/90 gentle-animation"
          >
            Projekt anfragen
          </button>
          <a
            href="#portfolio"
            className="glass-effect text-white font-semibold px-7 py-4 rounded-md hover:bg-white/20 gentle-animation"
          >
            Arbeiten ansehen
          </a>
        </motion.div>
      </div>

      {/* Bottom title */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 right-6 sm:right-8 lg:right-12 z-30 hidden lg:block"
      >
        <h2 className="text-right text-2xl xl:text-3xl font-black leading-tight text-white/90">
          <span className="block">Produktvideos.</span>
          <span className="block">Social Ads.</span>
          <span className="block">Performance Creatives.</span>
        </h2>
      </motion.div>
    </div>
  )
}
