'use client'
import { FadeUp } from './FadeUp'
import { useCmsList } from '@/hooks/useCms'

type Row = { id: string; step_number: string | null; title: string; description: string | null }

const FALLBACK: Row[] = [
  { id: '1', step_number: '01', title: 'Material senden', description: 'Produktbilder, vorhandenes Material oder ein Produktlink reichen für den Start aus.' },
  { id: '2', step_number: '02', title: 'Strategie', description: 'Wir prüfen Produkt, Zielgruppe, Plattform und Werbeziel.' },
  { id: '3', step_number: '03', title: 'Konzept', description: 'Hook, Szenenidee, Stilrichtung und Format werden auf den Einsatzkanal abgestimmt.' },
  { id: '4', step_number: '04', title: 'Produktion', description: 'Wir erstellen das Video mit moderner Video- und Postproduktion.' },
  { id: '5', step_number: '05', title: 'Lieferung', description: 'Du erhältst fertige Dateien für Social Ads, Shop, Landingpage oder Website.' },
]

export function About() {
  const steps = useCmsList<Row>('process_steps', FALLBACK)
  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeUp className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Prozess</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] leading-tight tracking-tight mb-5">
            Vom <span className="text-highlight">Produktlink</span> zum fertigen <span className="text-highlight">Werbevideo</span>.
          </h2>
          <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
            Ein klarer Ablauf – von der ersten Anfrage bis zur fertigen Video-Datei.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl">
          {steps.map((s, i) => (
            <FadeUp key={s.id} delay={i * 0.05}>
              <div className="relative h-full bg-[#141414] border border-white/[0.06] rounded-2xl p-6 hover:border-[#C9963B]/40 gentle-animation">
                {s.step_number && <div className="text-3xl font-black text-[#C9963B]/80 mb-3 tracking-tight">{s.step_number}</div>}
                <h3 className="font-bold text-base text-[#F4F0E8] mb-2">{s.title}</h3>
                {s.description && <p className="text-sm text-[#A8A29E] leading-relaxed">{s.description}</p>}
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-9 -right-2.5 w-5 h-px bg-[#C9963B]/30" />}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
