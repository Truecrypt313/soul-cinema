'use client'

import { Link } from 'react-router-dom'
import { Mail, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative py-20 bg-foreground text-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="font-bagel text-background text-3xl tracking-wider mb-4">
              Soul Cinema
            </div>
            <p className="text-background/70 leading-relaxed text-sm">
              Soul Cinema entwickelt Produktvideos und Performance Creatives für digitale und physische Produkte – für Social Media, Ads, Shops und Web.
            </p>
          </div>

          <div>
            <h4 className="font-black text-lg text-background mb-4">Kontakt</h4>
            <ul className="space-y-3 text-background/80 text-sm">
              <li>
                <a href="mailto:hallo@soulcinema.de" className="inline-flex items-center gap-2 hover:text-background gentle-animation">
                  <Mail className="w-4 h-4" /> hallo@soulcinema.de
                </a>
              </li>
              <li>
                <a href="https://www.soulcinema.de" className="inline-flex items-center gap-2 hover:text-background gentle-animation">
                  <Globe className="w-4 h-4" /> www.soulcinema.de
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-lg text-background mb-4">Navigation</h4>
            <ul className="space-y-2 text-background/80 text-sm">
              <li><a href="/#portfolio" className="hover:text-background gentle-animation">Arbeiten</a></li>
              <li><a href="/#about" className="hover:text-background gentle-animation">Prozess</a></li>
              <li><a href="/#services" className="hover:text-background gentle-animation">Leistungen</a></li>
              <li><a href="/#contact" className="hover:text-background gentle-animation">Anfrage</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
            <div>© {new Date().getFullYear()} Soul Cinema. Alle Rechte vorbehalten.</div>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/impressum" className="hover:text-background gentle-animation">Impressum</Link>
              <Link to="/datenschutz" className="hover:text-background gentle-animation">Datenschutz</Link>
              <Link to="/agb" className="hover:text-background gentle-animation">AGB</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
