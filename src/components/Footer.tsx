'use client'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useSettings, setting } from '@/hooks/useCms'
import { SoulCinemaWordmark } from '@/components/brand/SoulCinemaWordmark'

export function Footer() {
  const s = useSettings()
  const email = setting<string>(s, 'contact_email', 'hallo@soulcinema.de')
  const text = setting<string>(s, 'footer_text', 'Soul Cinema — Ad Studio für Produktvideos, Werbevideos und Social Ads. Für Shops, Landingpages, Marken und digitale Produkte.')
  return (
    <footer className="relative py-16 bg-background border-t border-white/[0.06]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="text-foreground mb-4"><SoulCinemaWordmark size={28} /></div>
            <p className="text-[#A8A29E] leading-relaxed text-sm max-w-sm">{text}</p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-[#A8A29E] text-sm">
              <li><a href="/#services" className="hover:text-[#C9963B] gentle-animation">Leistungen</a></li>
              <li><a href="/#portfolio" className="hover:text-[#C9963B] gentle-animation">Portfolio</a></li>
              <li><a href="/#process" className="hover:text-[#C9963B] gentle-animation">Prozess</a></li>
              <li><a href="/#pricing" className="hover:text-[#C9963B] gentle-animation">Preise</a></li>
              <li><a href="/#contact" className="hover:text-[#C9963B] gentle-animation">Kontakt</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wider">Kontakt</h4>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-[#A8A29E] hover:text-[#C9963B] gentle-animation text-sm">
              <Mail className="w-4 h-4" /> {email}
            </a>
          </div>
        </div>
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#A8A29E]">
          <div>© {new Date().getFullYear()} Soul Cinema. Alle Rechte vorbehalten.</div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/impressum" className="hover:text-[#C9963B] gentle-animation">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-[#C9963B] gentle-animation">Datenschutz</Link>
            <Link to="/agb" className="hover:text-[#C9963B] gentle-animation">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
