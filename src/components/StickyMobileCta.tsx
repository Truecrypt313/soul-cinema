'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useSettings, setting } from '@/hooks/useCms'
import { track } from '@/lib/analytics'

export function StickyMobileCta() {
  const s = useSettings()
  const primaryCta = setting<string>(s, 'primary_cta_label', 'Projekt anfragen')
  const whatsapp = setting<string>(s, 'whatsapp_number', '').replace(/[^0-9]/g, '')

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    const contact = document.getElementById('contact')
    if (!hero || !contact) return

    let heroOut = false
    let contactIn = false
    const update = () => setVisible(heroOut && !contactIn)

    const heroObs = new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; update() }, { threshold: 0.1 })
    const contactObs = new IntersectionObserver(([e]) => { contactIn = e.isIntersecting; update() }, { threshold: 0.15 })
    heroObs.observe(hero); contactObs.observe(contact)
    return () => { heroObs.disconnect(); contactObs.disconnect() }
  }, [])

  const goContact = () => {
    track({ event_name: 'cta_click', cta_id: 'sticky_mobile_primary' })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      aria-hidden={!visible}
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent pointer-events-none transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className={`flex gap-2 max-w-md mx-auto ${visible ? 'pointer-events-auto' : ''}`}>
        <button
          onClick={goContact}
          className="flex-1 bg-[#C9963B] text-[#0A0A0A] font-semibold px-5 py-3 rounded-md shadow-lg shadow-black/40 active:scale-[0.98] transition"
        >
          {primaryCta}
        </button>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            onClick={() => track({ event_name: 'external_link_click', cta_id: 'sticky_whatsapp', metadata: { target: 'whatsapp' } })}
            className="shrink-0 bg-[#1C1C1C] border border-white/10 text-[#F4F0E8] p-3 rounded-md flex items-center justify-center shadow-lg shadow-black/40"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  )
}
