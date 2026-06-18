'use client'
import { FadeUp } from './FadeUp'
import { useCmsList } from '@/hooks/useCms'

type Row = { id: string; step_number: string | null; title: string; description: string | null }

const FALLBACK: Row[] = [
  { id: '1', step_number: '01', title: 'Anfrage', description: 'Du lieferst: Produktlink, Bilder oder vorhandenes Material.||Wir machen: Erste Einschätzung zu Format, Ziel und Aufwand.' },
  { id: '2', step_number: '02', title: 'Briefing', description: 'Du lieferst: Antworten auf wenige kurze Fragen.||Wir machen: Zielgruppe, Plattform und Werbeziel klar.' },
  { id: '3', step_number: '03', title: 'Konzept', description: 'Du lieferst: Feedback zur Richtung.||Wir machen: Hook, Szenenidee, Stilrichtung und Format.' },
  { id: '4', step_number: '04', title: 'Produktion', description: 'Du lieferst: Freigabe.||Wir machen: Video, Schnitt, Sound, Text und Anpassungen.' },
  { id: '5', step_number: '05', title: 'Lieferung', description: 'Du bekommst: Fertige Videos für Social Ads, Shop, Landingpage oder Website.' },
]

function StepDescription({ text }: { text: string }) {
  const parts = text.split('||').map(p => p.trim()).filter(Boolean)
  if (parts.length === 0) return null
  return (
    <div className="space-y-1.5">
      {parts.map((p, i) => {
        const m = p.match(/^([^:]+:)\s*(.*)$/)
        if (!m) return <p key={i} className="text-sm text-[#B8B2AA] leading-relaxed">{p}</p>
        return (
          <p key={i} className="text-sm text-[#B8B2AA] leading-relaxed">
            <span className="text-[#C9963B]/90 font-semibold">{m[1]} </span>
            {m[2]}
          </p>
        )
      })}
    </div>
  )
}

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
          <p className="text-base sm:text-lg text-[#B8B2AA] leading-relaxed">
            Ein klarer Ablauf – von der ersten Anfrage bis zur fertigen Video-Datei.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl">
          {steps.map((s, i) => (
            <FadeUp key={s.id} delay={i * 0.05}>
              <div className="relative h-full bg-[#141414] border border-white/[0.06] rounded-2xl p-6 hover:border-[#C9963B]/40 gentle-animation">
                {s.step_number && <div className="text-3xl font-black text-[#C9963B]/80 mb-3 tracking-tight">{s.step_number}</div>}
                <h3 className="font-bold text-base text-[#F4F0E8] mb-3">{s.title}</h3>
                {s.description && <StepDescription text={s.description} />}
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-9 -right-2.5 w-5 h-px bg-[#C9963B]/30" />}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
