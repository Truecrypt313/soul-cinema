'use client'
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { FadeUp } from './FadeUp'

type Row = { id: string; name: string; company: string | null; avatar_url: string | null; quote: string; rating: number }

export function Testimonials() {
  const [items, setItems] = useState<Row[]>([])
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('testimonials').select('*').eq('visible', true).order('sort_order', { ascending: true })
      setItems((data as Row[]) ?? [])
    })()
  }, [])
  if (items.length === 0) return null
  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <FadeUp className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C9963B]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Stimmen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] tracking-tight">Was Kunden sagen.</h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl">
          {items.map((t, i) => (
            <FadeUp key={t.id} delay={i * 0.05}>
              <div className="h-full bg-[#141414] border border-white/[0.06] rounded-2xl p-7">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: Math.max(1, Math.min(5, t.rating || 5)) }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-[#C9963B] fill-[#C9963B]" />
                  ))}
                </div>
                <p className="text-[#F4F0E8]/90 leading-relaxed mb-5">„{t.quote}"</p>
                <div className="flex items-center gap-3">
                  {t.avatar_url && <img src={t.avatar_url} alt={t.name} loading="lazy" className="w-10 h-10 rounded-full object-cover" />}
                  <div>
                    <div className="font-semibold text-[#F4F0E8] text-sm">{t.name}</div>
                    {t.company && <div className="text-xs text-[#A8A29E]">{t.company}</div>}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
