'use client'

const TAGS = [
  'E-Commerce Shops',
  'Physische Produkte',
  'Digitale Produkte',
  'SaaS & Apps',
  'Produktlaunches',
  'Social Ads',
  'Marken & Startups',
]

export function Team() {
  return (
    <div className="relative py-32 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">Für wen Soul Cinema arbeitet</span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8 text-foreground">
            <span className="block mb-2">Für Produkte, die</span>
            <span className="block">online sichtbar werden sollen.</span>
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Soul Cinema arbeitet für Marken, Shops, Startups und Unternehmen, die ihre Produkte professionell präsentieren und mit starken Creatives mehr Aufmerksamkeit erzeugen möchten.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-card/80 via-card/40 to-card/80 clean-border rounded-3xl p-10 sm:p-14 elevated-shadow">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {TAGS.map((t, i) => (
                <span
                  key={t}
                  className="px-5 py-3 sm:px-6 sm:py-4 rounded-full bg-background/60 backdrop-blur-sm border border-border text-foreground font-semibold text-sm sm:text-base gentle-animation hover:scale-105 hover:border-accent-blue/40 cursor-default"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
