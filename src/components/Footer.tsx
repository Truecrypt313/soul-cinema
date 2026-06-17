'use client'

import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative py-16 bg-[#0A0A0A] border-t border-white/[0.06]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="font-bagel text-[#F4F0E8] text-2xl tracking-wider mb-4">Soul Cinema</div>
            <p className="text-[#A8A29E] leading-relaxed text-sm max-w-sm">
              Soul Cinema entwickelt <span className="text-highlight">Produktvideos</span> und Performance Creatives für digitale und physische Produkte – für Social Media, Ads, Shops und Web.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#F4F0E8] mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-[#A8A29E] text-sm">
              <li><a href="/#services" className="hover:text-[#C9963B] gentle-animation">Leistungen</a></li>
              <li><a href="/#portfolio" className="hover:text-[#C9963B] gentle-animation">Portfolio</a></li>
              <li><a href="/#process" className="hover:text-[#C9963B] gentle-animation">Prozess</a></li>
              <li><a href="/#pricing" className="hover:text-[#C9963B] gentle-animation">Preise</a></li>
              <li><a href="/#contact" className="hover:text-[#C9963B] gentle-animation">Kontakt</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#F4F0E8] mb-4 uppercase tracking-wider">Kontakt</h4>
            <a href="mailto:hallo@soulcinema.de" className="inline-flex items-center gap-2 text-[#A8A29E] hover:text-[#C9963B] gentle-animation text-sm">
              <Mail className="w-4 h-4" /> hallo@soulcinema.de
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
