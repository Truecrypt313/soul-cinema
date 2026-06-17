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
  phone: z.string().trim().max(60).optional().or(z.literal('')),
  product_url: z.string().trim().max(500).optional().or(z.literal('')),
  product_type: z.string().max(60).optional().or(z.literal('')),
  project_goal: z.string().max(60).optional().or(z.literal('')),
  budget: z.string().max(60).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Bitte Nachricht ausfüllen').max(4000),
})

const PRODUCT_TYPES = ['Physisches Produkt', 'Digitales Produkt', 'SaaS/App', 'E-Commerce Shop', 'Sonstiges']
const GOALS = ['Social Media Content', 'Paid Ads', 'Produktlaunch', 'Landingpage/Shop', 'Noch offen']
const BUDGETS = ['Noch offen', 'Unter 500 €', '500–1.000 €', '1.000–2.500 €', '2.500 €+']

const empty = {
  name: '', company: '', email: '', phone: '', product_url: '',
  product_type: '', project_goal: '', budget: '', message: '',
}

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
    const payload = {
      name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      product_url: parsed.data.product_url || null,
      product_type: parsed.data.product_type || null,
      project_goal: parsed.data.project_goal || null,
      budget: parsed.data.budget || null,
      message: parsed.data.message,
      status: 'new',
    }
    const { error } = await supabase.from('contact_leads').insert(payload)
    setBusy(false)
    if (error) {
      toast({
        title: 'Anfrage konnte nicht gesendet werden',
        description: 'Bitte versuchen Sie es erneut oder schreiben Sie an hallo@soulcinema.de.',
        variant: 'destructive',
      })
      return
    }
    toast({
      title: 'Danke!',
      description: 'Ihre Anfrage wurde gesendet. Soul Cinema meldet sich zeitnah zurück.',
    })
    setForm(empty)
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all'

  return (
    <section className="relative py-32 bg-card/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">Anfrage</span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
            Bereit für Ihr nächstes Produktvideo?
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-4">
            Senden Sie uns kurz Ihr Produkt, Ihre Website oder Ihre Idee. Wir prüfen, welcher Videoansatz passt, und melden uns mit einer Einschätzung zurück.
          </p>
          <a href="mailto:hallo@soulcinema.de" className="inline-flex items-center gap-2 text-foreground font-semibold hover:text-accent-blue gentle-animation">
            <Mail className="w-4 h-4" /> hallo@soulcinema.de
          </a>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-background clean-border rounded-3xl elevated-shadow p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Name *</label>
                <input id="name" type="text" required value={form.name} onChange={set('name')} className={inputCls} maxLength={200} />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-foreground mb-2">Unternehmen</label>
                <input id="company" type="text" value={form.company} onChange={set('company')} className={inputCls} maxLength={200} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">E-Mail *</label>
                <input id="email" type="email" required value={form.email} onChange={set('email')} className={inputCls} maxLength={255} />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">Telefon (optional)</label>
                <input id="phone" type="tel" value={form.phone} onChange={set('phone')} className={inputCls} maxLength={60} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="product_url" className="block text-sm font-semibold text-foreground mb-2">Website oder Produktlink</label>
                <input id="product_url" type="url" value={form.product_url} onChange={set('product_url')} className={inputCls} placeholder="https://…" maxLength={500} />
                <p className="text-xs text-muted-foreground mt-1">Ein Shop-, Amazon-, App- oder Landingpage-Link reicht aus.</p>
              </div>
              <div>
                <label htmlFor="product_type" className="block text-sm font-semibold text-foreground mb-2">Produkttyp *</label>
                <select id="product_type" required value={form.product_type} onChange={set('product_type')} className={inputCls}>
                  <option value="">Bitte wählen</option>
                  {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="project_goal" className="block text-sm font-semibold text-foreground mb-2">Gewünschtes Ziel</label>
                <select id="project_goal" value={form.project_goal} onChange={set('project_goal')} className={inputCls}>
                  <option value="">Bitte wählen</option>
                  {GOALS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="budget" className="block text-sm font-semibold text-foreground mb-2">Budget (optional)</label>
                <select id="budget" value={form.budget} onChange={set('budget')} className={inputCls}>
                  <option value="">Bitte wählen</option>
                  {BUDGETS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">Nachricht *</label>
              <textarea
                id="message"
                required
                rows={6}
                maxLength={4000}
                value={form.message}
                onChange={set('message')}
                className={`${inputCls} resize-none`}
                placeholder="Beschreiben Sie kurz Ihr Produkt, Zielgruppe, Plattform und ob Produktbilder oder ein Produktlink vorhanden sind."
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-foreground text-background font-black text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {busy ? 'Wird gesendet…' : (<><Send className="w-5 h-5" /> Anfrage senden</>)}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Antwort in der Regel innerhalb von 24 Stunden. Mit dem Absenden stimmen Sie zu, dass wir Ihre Angaben zur Bearbeitung Ihrer Anfrage verarbeiten dürfen. Details siehe <a href="/datenschutz" className="underline">Datenschutz</a>.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
