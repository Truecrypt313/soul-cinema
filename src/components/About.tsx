'use client'

const STEPS = [
  { number: '01', title: 'Anfrage', text: 'Sie senden uns Produktbilder, vorhandenes Material oder einen Produktlink.' },
  { number: '02', title: 'Analyse', text: 'Wir prüfen Produkt, Zielgruppe, Plattform und Werbeziel.' },
  { number: '03', title: 'Konzept', text: 'Wir entwickeln Hook, Szenenidee, Stilrichtung und passende Formate.' },
  { number: '04', title: 'Produktion', text: 'Wir produzieren das Video mit moderner Video- und Postproduktion.' },
  { number: '05', title: 'Lieferung', text: 'Sie erhalten fertige Videos für Social Media, Paid Ads, Shops oder Landingpages.' },
]

export function About() {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.8) 1px, transparent 0)',
        backgroundSize: '3px 3px',
        animation: 'filmGrain 8s infinite',
      }} />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">Prozess</span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
            Von der Produktidee zum fertigen Ad Creative.
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Ein klarer Produktionsprozess – vom ersten Briefing bis zum fertigen Video.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((s, i) => (
              <div
                key={s.number}
                className="relative bg-card/60 clean-border rounded-2xl p-6 subtle-shadow gentle-animation hover:elevated-shadow hover:-translate-y-1"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                  {s.number}
                </div>
                <h3 className="font-black text-lg mt-4 mb-3 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 bg-card/80 backdrop-blur-sm clean-border rounded-2xl px-8 py-4 subtle-shadow flex-wrap justify-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-foreground">Klare Konzepte</span>
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-foreground">Moderne Produktion</span>
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-foreground">Social-Media-optimiert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
