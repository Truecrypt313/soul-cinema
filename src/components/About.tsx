'use client'

const STEPS = [
  { number: '01', title: 'Anfrage & Briefing', text: 'Sie senden uns Produktbilder, vorhandenes Material oder einen Produktlink.' },
  { number: '02', title: 'Analyse & Strategie', text: 'Wir prüfen Produkt, Zielgruppe, Plattform und Werbeziel.' },
  { number: '03', title: 'Konzept & Story', text: 'Wir entwickeln Hook, Szenenidee, Stilrichtung und passende Formate.' },
  { number: '04', title: 'Produktion & Postproduktion', text: 'Wir produzieren das Video mit moderner Video- und Postproduktion.' },
  { number: '05', title: 'Lieferung & Formate', text: 'Sie erhalten fertige Videos für Social Media, Paid Ads, Shops oder Landingpages.' },
]

export function About() {
  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Prozess</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] leading-tight tracking-tight mb-5">
            Vom <span className="text-highlight">Produktlink</span> zum fertigen <span className="text-highlight">Werbevideo</span>.
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            Ein klarer Ablauf – von der ersten Anfrage bis zur <span className="text-highlight">fertigen Video-Datei</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl">
          {STEPS.map((s, i) => (
            <div
              key={s.number}
              className="relative bg-[#141414] border border-white/[0.06] rounded-2xl p-6 hover:border-[#C9963B]/40 gentle-animation"
            >
              <div className="text-3xl font-black text-[#C9963B]/80 mb-3 tracking-tight">{s.number}</div>
              <h3 className="font-bold text-base text-[#F4F0E8] mb-2">{s.title}</h3>
              <p className="text-sm text-[#A8A29E] leading-relaxed">{s.text}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-9 -right-2.5 w-5 h-px bg-[#C9963B]/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
