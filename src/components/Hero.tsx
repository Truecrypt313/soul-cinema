'use client'

import { motion } from 'framer-motion'
import { Volume2, VolumeX, Menu, X, Check, ArrowUpRight } from 'lucide-react'
import { ThemeToggle } from './theme/ThemeToggle'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useSettings, setting } from '@/hooks/useCms'
import { track } from '@/lib/analytics'
import { parseBool, parseVolume, resolveAudioUrl } from '@/lib/audioMedia'

// Reduced bullet-word navigation for a creative-studio feel.
// Each item carries a soft tinted hover surface (Coral / Pink / Blue / Lavender).
const NAV: Array<{ href: string; label: string; hover: string; dot: string }> = [
  { href: '#portfolio', label: 'Work',   hover: 'hover:bg-soft-pink',     dot: 'bg-accent-pink' },
  { href: '#services',  label: 'Videos', hover: 'hover:bg-soft-coral',    dot: 'bg-primary' },
  { href: '#process',   label: 'Ablauf', hover: 'hover:bg-soft-blue',     dot: 'bg-accent-blue' },
  { href: '#pricing',   label: 'Preise', hover: 'hover:bg-soft-lavender', dot: 'bg-accent-lavender' },
]
const MOBILE_NAV = [...NAV, { href: '#contact', label: 'Kontakt', hover: 'hover:bg-soft-coral', dot: 'bg-primary' }]

const FALLBACK_VIDEO = 'https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm'

const HIGHLIGHT_WORD = 'Kinoreif'

/**
 * Split the headline into structured lines.
 * Cases:
 *  - "Dein Produkt. Kinoreif in Szene gesetzt." -> 3 lines, middle is highlight word
 *  - Other headlines containing "Kinoreif" -> split by sentence + highlight word
 *  - Fallback: single line, but highlight occurrences of "Produkt" and "Kinoreif"
 */
export function splitHeroHeadline(headline: string): Array<{ text: string; highlight?: boolean }[]> {
  const h = (headline || '').trim()
  // Sentence split on ". " preserving trailing dot
  const sentences = h.split(/(?<=\.)\s+/).filter(Boolean)
  const lines: Array<{ text: string; highlight?: boolean }[]> = []

  for (const s of sentences) {
    if (s.includes(HIGHLIGHT_WORD)) {
      // Split sentence around the highlight word
      const parts = s.split(new RegExp(`(${HIGHLIGHT_WORD})`))
      const before = parts[0]?.trim()
      const after = parts.slice(2).join('').trim()
      if (before) lines.push([{ text: before }])
      lines.push([{ text: HIGHLIGHT_WORD, highlight: true }])
      if (after) lines.push([{ text: after }])
    } else {
      lines.push([{ text: s }])
    }
  }
  return lines.length ? lines : [[{ text: h }]]
}

export function Hero() {
  const s = useSettings()
  const videoUrl = setting<string>(s, 'hero_video_url', FALLBACK_VIDEO)
  const posterUrl = setting<string>(s, 'hero_poster_url', '')
  const posterMobile = setting<string>(s, 'hero_poster_mobile_url', '')
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

  // ── Music settings ──────────────────────────────────────
  const musicEnabled = parseBool(s.music_enabled, false)
  const musicUrlRaw = setting<string>(s, 'music_url', '')
  const musicVolume = parseVolume(s.music_volume, 0.35)
  const musicLoop = parseBool(s.music_loop, true)
  const musicLabel = setting<string>(s, 'music_label', 'Soundtrack')
  const musicShowControl = parseBool(s.music_show_control, true)

  const [musicSrc, setMusicSrc] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    if (!musicEnabled || !musicUrlRaw) { setMusicSrc(null); return }
    resolveAudioUrl(musicUrlRaw).then((u) => { if (active) setMusicSrc(u) })
    return () => { active = false }
  }, [musicEnabled, musicUrlRaw])

  const musicActive = musicEnabled && musicShowControl && !!musicSrc

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  const effectivePoster = (isMobile ? (posterMobile || posterUrl) : posterUrl) || undefined

  // Video mute state (used when music feature is OFF; otherwise video stays muted)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  // Music playing state (independent of video)
  const [musicPlaying, setMusicPlaying] = useState(false)

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep video muted whenever music feature is active to avoid audio collision.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const shouldMute = musicActive ? true : isVideoMuted
    v.muted = shouldMute
    v.volume = shouldMute ? 0 : 0.7
  }, [isVideoMuted, musicActive])

  // Sync audio volume + loop (do NOT autoplay).
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = musicVolume
    a.loop = musicLoop
  }, [musicVolume, musicLoop, musicSrc])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMobileMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobileMenuOpen])

  const goContact = () => {
    track({ event_name: 'cta_click', cta_id: 'hero_primary' })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  const toggleSound = async () => {
    if (musicActive) {
      const a = audioRef.current
      if (!a) return
      try {
        if (musicPlaying) {
          a.pause()
          setMusicPlaying(false)
        } else {
          a.volume = musicVolume
          a.loop = musicLoop
          await a.play()
          setMusicPlaying(true)
        }
      } catch (e) {
        console.warn('[hero] music playback failed', e)
        setMusicPlaying(false)
      }
    } else {
      setIsVideoMuted((m) => !m)
    }
  }

  const soundOn = musicActive ? musicPlaying : !isVideoMuted
  const soundAriaLabel = musicActive
    ? (musicPlaying ? `${musicLabel} pausieren` : `${musicLabel} abspielen`)
    : (isVideoMuted ? 'Ton aktivieren' : 'Ton stummschalten')

  const headlineLines = useMemo(() => splitHeroHeadline(headline), [headline])

  const highlightWords = ['Produktbilder', 'Produktlink', 'Produktvideos', 'Social Ads', 'Shops', 'Landingpages']
  const renderHighlighted = (text: string) => {
    const re = new RegExp(`(${highlightWords.join('|')})`, 'g')
    return text.split(re).map((part, i) =>
      highlightWords.includes(part)
        ? <span key={i} className="text-highlight font-semibold">{part}</span>
        : <span key={i}>{part}</span>
    )
  }

  const showSoundButton = musicActive || true // keep video sound button by default

  return (
    <div className="stage-dark relative min-h-[100svh] w-full overflow-hidden film-grain">
      <video
        ref={videoRef}
        key={videoUrl}
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay muted loop playsInline preload="metadata"
        poster={effectivePoster}
        aria-label="Hintergrundvideo: kinoreife Produktaufnahmen"
      >
        <source src={videoUrl} />
      </video>

      {musicActive && musicSrc && (
        <audio
          ref={audioRef}
          src={musicSrc}
          preload="none"
          onEnded={() => { if (!musicLoop) setMusicPlaying(false) }}
          onError={() => { console.warn('[hero] audio error for', musicSrc); setMusicPlaying(false) }}
        />
      )}

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/55 via-black/15 to-black/85 sm:hidden" />
      <div className="absolute inset-0 hidden sm:block pointer-events-none bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      <div className="absolute inset-0 hidden sm:block pointer-events-none bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* ────────── Floating Pill Navbar ────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-3 sm:top-4 left-0 right-0 z-[110] px-3 sm:px-6"
        aria-label="Hauptnavigation"
      >
        <div className={`mx-auto max-w-6xl flex items-center justify-between gap-3 rounded-full pl-4 pr-2 sm:pl-5 sm:pr-2.5 py-2 transition-all duration-300 backdrop-blur-xl border ${
          isScrolled
            ? 'bg-background/85 border-border shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)]'
            : 'bg-background/55 border-white/15 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.35)]'
        }`}>
          {/* Brand */}
          <a
            href="#hero"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-brand text-foreground text-lg sm:text-xl tracking-wide cursor-pointer shrink-0 hover:text-primary gentle-animation"
          >
            Soul Cinema
          </a>

          {/* Center pill nav (desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-foreground/[0.04] dark:bg-white/5 rounded-full p-1 border border-foreground/[0.06] dark:border-white/10">
            {NAV.map(n => (
              <a
                key={n.href}
                href={n.href}
                className={`group relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-foreground/80 hover:text-foreground gentle-animation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${n.hover}`}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${n.dot} opacity-0 group-hover:opacity-100 transition-opacity`} />
                {n.label}
              </a>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {showSoundButton && (
              <button onClick={toggleSound} aria-label={soundAriaLabel} title={soundAriaLabel}
                className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card/60 text-foreground hover:text-primary hover:border-primary/40 gentle-animation">
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}
            <span className="hidden sm:inline-flex">
              <ThemeToggle variant="plain" />
            </span>
            <button
              onClick={goContact}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary via-accent-pink to-primary shadow-[0_8px_24px_-10px_color-mix(in_srgb,var(--primary)_70%,transparent)] hover:shadow-[0_12px_30px_-10px_color-mix(in_srgb,var(--primary)_80%,transparent)] hover:-translate-y-0.5 gentle-animation"
            >
              Projekt starten
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
              className="lg:hidden inline-flex items-center gap-2 rounded-full pl-3 pr-3 py-2 text-sm font-semibold text-foreground border border-border bg-card/70 hover:border-primary/40 hover:text-primary gentle-animation z-[120] relative"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ────────── Mobile Overlay Menu ────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-foreground/40 backdrop-blur-md z-[80]" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <motion.div
        id="mobile-nav"
        initial={false}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[88vw] bg-background/95 backdrop-blur-2xl border-l border-border z-[90] shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col h-full p-6 pt-24">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Menu</p>
          <div className="flex flex-col space-y-1">
            {MOBILE_NAV.map(n => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-foreground text-lg font-medium font-brand tracking-tight gentle-animation ${n.hover}`}
              >
                <span className="flex items-center gap-3">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${n.dot}`} />
                  {n.label}
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Product videos. Social ads. Launch creatives.
          </p>
          <button
            onClick={goContact}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary via-accent-pink to-primary shadow-[0_10px_30px_-12px_color-mix(in_srgb,var(--primary)_75%,transparent)]"
          >
            Projekt starten
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Theme</span>
            <ThemeToggle variant="plain" />
          </div>
        </div>
      </motion.div>

      <div className="relative z-20 min-h-[100svh] flex flex-col justify-center py-24 sm:py-0 px-6 sm:px-8 lg:px-12 max-w-5xl">

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}
          className="font-brand text-[#F4F0E8] tracking-tight mb-5 sm:mb-6 max-w-4xl"
        >
          {headlineLines.map((line, li) => {
            const isHighlightLine = line.length === 1 && line[0].highlight
            if (isHighlightLine) {
              return (
                <span
                  key={li}
                  className="block leading-[0.95] text-[3.25rem] sm:text-7xl lg:text-[9rem] text-gradient-brand italic tracking-tight"
                  style={{
                    filter: 'drop-shadow(0 4px 28px rgba(249, 115, 74, 0.35))',
                  }}
                >
                  {line[0].text}
                </span>
              )
            }
            return (
              <span key={li} className="block leading-[1.05] text-[2rem] sm:text-5xl lg:text-6xl">
                {line.map((seg, si) => seg.highlight
                  ? <span key={si} className="text-highlight italic">{seg.text}</span>
                  : <span key={si}>{seg.text}</span>
                )}
              </span>
            )
          })}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75 }}
          className="sm:hidden text-base text-[#F4F0E8]/85 mb-6 leading-relaxed">
          {renderHighlighted(sublineMobile)}
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75 }}
          className="hidden sm:block text-lg lg:text-xl text-[#F4F0E8]/85 max-w-2xl mb-3 leading-relaxed">
          {renderHighlighted(sublineDesktop)}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.9 }}
          className="hidden sm:block text-sm sm:text-base text-[#A8A29E] max-w-2xl mb-8">
          {secondary}
        </motion.p>

        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.05 }}
          className="sm:hidden flex flex-col gap-2 text-[#F4F0E8]/85 text-sm mb-6">
          {mobileBullets.map(b => (
            <li key={b} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C9963B] mt-0.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </motion.ul>
        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.05 }}
          className="hidden sm:grid grid-cols-2 gap-x-6 gap-y-2 text-[#F4F0E8]/85 text-sm mb-8 max-w-2xl">
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
          <a href="#portfolio" onClick={() => track({ event_name: 'cta_click', cta_id: 'hero_secondary_portfolio' })} className="w-full sm:w-auto text-center text-[#F4F0E8]/85 sm:glass-effect sm:text-[#F4F0E8] font-medium sm:font-semibold px-7 py-3 sm:py-3.5 rounded-md hover:text-[#C9963B] gentle-animation min-h-12 flex items-center justify-center underline-offset-4 underline sm:no-underline">
            {secondaryCta}
          </a>
        </motion.div>
      </div>
    </div>
  )
}
