'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Mail, Send, CheckCircle2, MessageCircle, Calendar } from 'lucide-react'
import { FadeUp } from './FadeUp'
import { useSettings, setting } from '@/hooks/useCms'

const schema = z.object({
  name: z.string().trim().min(1, 'Bitte Namen angeben').max(200),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  email: z.string().trim().email('Bitte gültige E-Mail angeben').max(255),
  phone: z.string().trim().max(60).optional().or(z.literal('')),
  product_url: z.string().trim().max(500).optional().or(z.literal('')),
  product_type: z.string().max(60).optional().or(z.literal('')),
  project_goal: z.string().max(60).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Bitte Projektbeschreibung ausfüllen').max(4000),
  budget: z.string().max(60).optional().or(z.literal('')),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot
})

const BUDGETS = ['Noch offen', '790 € – 1.500 €', '1.500 € – 3.000 €', '3.000 € – 5.000 €', '5.000 €+']
const PRODUCT_TYPES = ['Physisches Produkt', 'Digitales Produkt', 'SaaS & App', 'E-Commerce', 'Sonstiges']
const GOALS = ['Social Ads', 'Produktvideo', 'Shop / Landingpage', 'Launch Creative', 'Content Package', 'Noch offen']

const empty = { name: '', company: '', email: '', phone: '', product_url: '', product_type: '', project_goal: '', message: '', budget: '', website: '' }

export function Contact() {
  const { toast } = useToast()
  const s = useSettings()
  const email = setting<string>(s, 'contact_email', 'hallo@soulcinema.de')
  const whatsapp = setting<string>(s, 'whatsapp_number', '')
  const calendly = setting<string>(s, 'calendly_url', '')

  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }))
    setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = schema.safeParse(form)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message
      setErrors(errs)
      return
    }
    if (form.website) {
      // Spam: silently discard, reset form, no thank-you card
      setForm(empty)
      return
    }
    setBusy(true)
    const { error } = await supabase.from('contact_leads').insert({
      name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      product_url: parsed.data.product_url || null,
      product_type: parsed.data.product_type || null,
      project_goal: parsed.data.project_goal || null,
      message: parsed.data.message,
      budget: parsed.data.budget || null,
      status: 'new',
    })
    setBusy(false)
    if (error) {
      toast({ title: 'Anfrage konnte nicht gesendet werden', description: `Bitte erneut versuchen oder an ${email} schreiben.`, variant: 'destructive' })
      return
    }
    setSent({ name: parsed.data.name, email: parsed.data.email })
    setForm(empty)
  }

  const inputCls = 'w-full px-4 py-3 rounded-lg bg-[#1C1C1C] border border-white/[0.08] text-[#F4F0E8] placeholder:text-[#A8A29E]/60 focus:outline-none focus:border-[#C9963B]/60 focus:ring-1 focus:ring-[#C9963B]/40 gentle-animation'
  const errCls = 'text-xs text-red-400 mt-1'

  return (
    <section className="relative py-28 sm:py-32 bg-[#0A0A0A] border-t border-white/[0.04]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <FadeUp>
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
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-[#F4F0E8] hover:text-[#C9963B] gentle-animation">
                <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#C9963B]" />
                </div>
                <span className="font-medium">{email}</span>
              </a>
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener" className="flex items-center gap-3 text-[#F4F0E8] hover:text-[#C9963B] gentle-animation">
                  <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center"><MessageCircle className="w-4 h-4 text-[#C9963B]" /></div>
                  <span className="font-medium">WhatsApp: {whatsapp}</span>
                </a>
              )}
              {calendly && (
                <a href={calendly} target="_blank" rel="noopener" className="flex items-center gap-3 text-[#F4F0E8] hover:text-[#C9963B] gentle-animation">
                  <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center"><Calendar className="w-4 h-4 text-[#C9963B]" /></div>
                  <span className="font-medium">Termin buchen</span>
                </a>
              )}
              <div className="text-sm text-[#A8A29E]">Antwort in der Regel innerhalb von <span className="text-highlight font-semibold">24 Stunden</span>.</div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            {sent ? (
              <div className="bg-[#141414] border border-[#C9963B]/40 rounded-2xl p-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-accent-soft flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-7 h-7 text-[#C9963B]" />
                </div>
                <h3 className="text-2xl font-bold text-[#F4F0E8] mb-3">Danke, {sent.name}!</h3>
                <p className="text-[#A8A29E] mb-2">Wir haben deine Anfrage erhalten und melden uns in der Regel innerhalb von <span className="text-highlight font-semibold">24 Stunden</span>.</p>
                <p className="text-sm text-[#A8A29E]/80">Wir melden uns per E-Mail an <span className="text-[#F4F0E8] font-medium">{sent.email}</span>.</p>
                <button onClick={() => setSent(null)} className="mt-6 text-sm text-[#C9963B] hover:underline">Weitere Anfrage senden</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-7 sm:p-8 space-y-5" noValidate>
                {/* honeypot */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')}
                  className="absolute left-[-9999px] w-px h-px opacity-0" aria-hidden="true" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Name *</label>
                    <input id="name" required value={form.name} onChange={set('name')} className={inputCls} maxLength={200} />
                    {errors.name && <p className={errCls}>{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">E-Mail *</label>
                    <input id="email" type="email" required value={form.email} onChange={set('email')} className={inputCls} maxLength={255} />
                    {errors.email && <p className={errCls}>{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Unternehmen</label>
                    <input id="company" value={form.company} onChange={set('company')} className={inputCls} maxLength={200} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Telefon</label>
                    <input id="phone" type="tel" value={form.phone} onChange={set('phone')} className={inputCls} maxLength={60} />
                  </div>
                </div>

                <div>
                  <label htmlFor="product_url" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Website oder Produktlink</label>
                  <input id="product_url" type="url" value={form.product_url} onChange={set('product_url')} className={inputCls} placeholder="https://…" maxLength={500} />
                  <p className="text-xs mt-1.5"><span className="text-highlight font-semibold">Ein Shop-, Amazon-, App- oder Landingpage-Link reicht aus.</span></p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="product_type" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Produkttyp</label>
                    <select id="product_type" value={form.product_type} onChange={set('product_type')} className={inputCls}>
                      <option value="">Bitte wählen</option>
                      {PRODUCT_TYPES.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="project_goal" className="block text-xs font-semibold text-[#F4F0E8] mb-2 uppercase tracking-wider">Gewünschtes Ziel</label>
                    <select id="project_goal" value={form.project_goal} onChange={set('project_goal')} className={inputCls}>
                      <option value="">Bitte wählen</option>
                      {GOALS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
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
                  <textarea id="message" required rows={5} maxLength={4000} value={form.message} onChange={set('message')}
                    className={`${inputCls} resize-none`}
                    placeholder="Produkt, Zielgruppe, Plattform – und ob Produktbilder oder ein Produktlink vorhanden sind." />
                  {errors.message && <p className={errCls}>{errors.message}</p>}
                </div>

                <button type="submit" disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-md bg-[#C9963B] text-[#0A0A0A] font-bold hover:bg-[#d9a64b] gentle-animation disabled:opacity-50">
                  {busy ? 'Wird gesendet…' : (<><Send className="w-4 h-4" /> Projekt anfragen</>)}
                </button>

                <p className="text-xs text-[#A8A29E] text-center">
                  Keine automatische Buchung. Wir prüfen deine Anfrage persönlich.
                </p>
                <p className="text-[11px] text-[#A8A29E]/80 text-center leading-relaxed">
                  Mit dem Absenden stimmen Sie zu, dass wir Ihre Angaben zur Bearbeitung Ihrer Anfrage verarbeiten dürfen. Details siehe <a href="/datenschutz" className="underline hover:text-[#C9963B]">Datenschutz</a>.
                </p>
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
