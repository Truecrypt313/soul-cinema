'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Mail, Send } from 'lucide-react'

const schema = z.object({
  name: z.string().trim().min(1, 'Bitte Namen angeben').max(200),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  email: z.string().trim().email('Bitte gültige E-Mail angeben').max(255),
  product_url: z.string().trim().max(500).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Bitte Projektbeschreibung ausfüllen').max(4000),
  budget: z.string().max(60).optional().or(z.literal('')),
})

const BUDGETS = ['Noch offen', 'Unter 1.000 €', '1.000–2.500 €', '2.500–5.000 €', '5.000 €+']

const empty = { name: '', company: '', email: '', product_url: '', message: '', budget: '' }

export function Contact() {
  const { toast } = useToast()
  const [form, setForm] = useState(empty)
  const [busy, setBusy] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = schema.safeParse(form)
    if (!parsed.success) {
      toast({ title: 'Bitte Eingaben prüfen', description: parsed.error.issues[0]?.message, variant: 'destructive' })
      return
    }
    setBusy(true)
    const { error } = await supabase.from('contact_leads').insert({
      name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      product_url: parsed.data.product_url || null,
      message: parsed.data.message,
      budget: parsed.data.budget || null,
      status: 'new',
    })
    setBusy(false)
    if (error) {
      toast({
        title: 'Anfrage konnte nicht gesendet werden',
        description: 'Bitte versuchen Sie es erneut oder schreiben Sie an hallo@soulcinema.de.',
        variant: 'destructive',
      })
      return
    }
    toast({ title: 'Danke!', description: 'Ihre Anfrage wurde gesendet. Wir melden uns zeitnah zurück.' })
    setForm(empty)
  }

  const inputCls = 'w-full px-4 py-3 rounded-lg bg-[#1C1C1C] border border-white/[0.08] text-[#F4F0E8] placeholder:text-[#A8A29E]/60 focus:outline-none focus:border-[#C9963B]/60 focus:ring-1 focus:ring-[#C9963B]/40 gentle-animation'

  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-[#C9963B]" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9963B]">Kontakt</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E8] leading-tight tracking-tight mb-5">
              Bereit, dein <span className="text-highlight">Produkt sichtbar</span> zu machen?
            </h2>
            <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed mb-8">
              Senden Sie uns kurz Ihr Produkt, Ihre Website oder Ihre Idee. Wir prüfen, welcher Videoansatz passt, und melden uns mit einer Einschätzung zurück.
            </p>

            <div className="space-y-4">
              <a href="mailto:hallo@soulcinema.de" className="flex items-center gap-3 text-[#F4F0E8] hover:text-[#C9963B] gentle-animation group">
                <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#C9963B]" />
                </div>
                <span className="font-medium">hallo@soulcinema.de</span>
              </a>
              <div className="text-sm text-[#A8A29E] pl-13">
                Antwort in der Regel innerhalb von <span className="text-highlight font-semibold">24 Stunden</span>.
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-7 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Name *</label>
                <input id="name" required value={form.name} onChange={set('name')} className={inputCls} maxLength={200} />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">E-Mail *</label>
                <input id="email" type="email" required value={form.email} onChange={set('email')} className={inputCls} maxLength={255} />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Unternehmen (optional)</label>
              <input id="company" value={form.company} onChange={set('company')} className={inputCls} maxLength={200} />
            </div>

            <div>
              <label htmlFor="product_url" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Website oder Produktlink</label>
              <input id="product_url" type="url" value={form.product_url} onChange={set('product_url')} className={inputCls} placeholder="https://…" maxLength={500} />
              <p className="text-xs text-[#A8A29E]/80 mt-1.5">Ein Shop-, Amazon-, App- oder Landingpage-Link reicht aus.</p>
            </div>

            <div>
              <label htmlFor="budget" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Budget</label>
              <select id="budget" value={form.budget} onChange={set('budget')} className={inputCls}>
                <option value="">Bitte wählen</option>
                {BUDGETS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Projektbeschreibung *</label>
              <textarea
                id="message" required rows={5} maxLength={4000}
                value={form.message} onChange={set('message')}
                className={`${inputCls} resize-none`}
                placeholder="Produkt, Zielgruppe, Plattform – und ob Produktbilder oder ein Produktlink vorhanden sind."
              />
            </div>

            <button
              type="submit" disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-md bg-[#C9963B] text-[#0A0A0A] font-bold hover:bg-[#d9a64b] gentle-animation disabled:opacity-50"
            >
              {busy ? 'Wird gesendet…' : (<><Send className="w-4 h-4" /> Projekt anfragen</>)}
            </button>

            <p className="text-[11px] text-[#A8A29E]/80 text-center leading-relaxed">
              Mit dem Absenden stimmen Sie zu, dass wir Ihre Angaben zur Bearbeitung Ihrer Anfrage verarbeiten dürfen. Details siehe <a href="/datenschutz" className="underline hover:text-[#C9963B]">Datenschutz</a>.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
