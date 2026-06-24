'use client'

import { useEffect, useState } from 'react'
import { Link, Route, Routes, Navigate, useNavigate, NavLink } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import type { Session, User } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'
import { LayoutDashboard, Inbox, Briefcase, Sparkles, ListOrdered, Heart, Users, Tag, HelpCircle, Star, FileText, LogOut, Menu, X, BarChart3, Wand2 } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

import AdminDashboard from './AdminDashboard'
import AdminLeads from './AdminLeads'
import AdminPortfolio from './AdminPortfolio'
import AdminServices from './AdminServices'
import AdminProcess from './AdminProcess'
import AdminReasons from './AdminReasons'
import AdminAudience from './AdminAudience'
import AdminPricing from './AdminPricing'
import AdminFAQ from './AdminFAQ'
import AdminTestimonials from './AdminTestimonials'
import AdminSettings from './AdminSettings'
import AdminAnalytics from './AdminAnalytics'
import AdminCreativeStyles from './AdminCreativeStyles'

type AuthState = 'loading' | 'guest' | 'authenticated'

const NAV_GROUPS: { label: string; items: { to: string; icon: any; label: string; end?: boolean }[] }[] = [
  {
    label: 'Übersicht',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/admin/anfragen', icon: Inbox, label: 'Anfragen' },
    ],
  },
  {
    label: 'Website-Inhalte',
    items: [
      { to: '/admin/portfolio', icon: Briefcase, label: 'Portfolio' },
      { to: '/admin/leistungen', icon: Sparkles, label: 'Leistungen' },
      { to: '/admin/prozess', icon: ListOrdered, label: 'Prozess' },
      { to: '/admin/warum', icon: Heart, label: 'Warum Soul Cinema' },
      { to: '/admin/zielgruppen', icon: Users, label: 'Zielgruppen' },
      { to: '/admin/preise', icon: Tag, label: 'Preise' },
      { to: '/admin/faq', icon: HelpCircle, label: 'FAQ' },
      { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
      { to: '/admin/creative-styles', icon: Wand2, label: 'Creative Styles' },
    ],
  },
  {
    label: 'Website & System',
    items: [
      { to: '/admin/einstellungen', icon: FileText, label: 'Einstellungen' },
    ],
  },
]

export default function Admin() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminExists, setAdminExists] = useState<boolean>(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => handleSession(session))
    supabase.auth.getSession().then(({ data }) => handleSession(data.session))
    return () => subscription.unsubscribe()
  }, [])

  const handleSession = async (session: Session | null) => {
    if (!session) {
      setUser(null); setIsAdmin(false)
      const { data } = await supabase.rpc('admin_exists')
      setAdminExists(Boolean(data))
      setAuthState('guest')
      return
    }
    setUser(session.user)
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).eq('role', 'admin').maybeSingle()
    setIsAdmin(Boolean(roleData))
    const { data: exists } = await supabase.rpc('admin_exists')
    setAdminExists(Boolean(exists))
    setAuthState('authenticated')
  }

  const claimAdmin = async (code: string) => {
    const { data: codeRow } = await supabase.from('site_settings').select('value').eq('key', 'admin_setup_code').maybeSingle()
    const expected = typeof codeRow?.value === 'string' ? codeRow.value : ''
    if (!expected || code !== expected) {
      toast({ title: 'Setup-Code ungültig', variant: 'destructive' })
      return
    }
    const { data, error } = await supabase.rpc('claim_admin')
    if (error || !data) {
      toast({ title: 'Admin-Setup fehlgeschlagen', description: 'Möglicherweise existiert bereits ein Admin.', variant: 'destructive' })
      return
    }
    setIsAdmin(true); setAdminExists(true)
    toast({ title: 'Admin-Zugang aktiviert' })
  }

  const signOut = async () => { await supabase.auth.signOut(); navigate('/admin') }

  if (authState === 'loading') return <CenterMsg text="Lade…" />
  if (authState === 'guest') return <AuthScreen adminExists={adminExists} />

  if (!isAdmin) {
    return (
      <CenterCard>
        <h1 className="text-2xl font-black mb-2">Eingeloggt als {user?.email}</h1>
        {adminExists ? (
          <>
            <p className="text-muted-foreground mb-6">Dieser Account hat keine Admin-Berechtigung.</p>
            <button onClick={signOut} className="px-4 py-2 rounded-md bg-foreground text-background font-semibold">Abmelden</button>
          </>
        ) : (
          <SetupCodeForm onSubmit={claimAdmin} onCancel={signOut} />
        )}
      </CenterCard>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform overflow-y-auto`}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link to="/" className="font-brand text-xl text-foreground">Soul Cinema</Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <nav className="p-3 space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <div className="px-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{group.label}</div>
              <div className="space-y-0.5">
                {group.items.map(n => (
                  <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium gentle-animation ${
                      isActive ? 'bg-[#C9963B]/15 text-[#C9963B]' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                    }`}>
                    <n.icon className="w-4 h-4" /> {n.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 mt-2 border-t border-border">
          <div className="text-xs text-muted-foreground px-3 mb-2 truncate">{user?.email}</div>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5">
            <LogOut className="w-4 h-4" /> Abmelden
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-card/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2"><Menu className="w-5 h-5" /></button>
          <Link to="/" className="font-brand text-lg">Soul Cinema</Link>
          <ThemeToggle />
        </header>
        <main className="p-6 lg:p-10 max-w-6xl">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="anfragen" element={<AdminLeads />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="leistungen" element={<AdminServices />} />
            <Route path="prozess" element={<AdminProcess />} />
            <Route path="warum" element={<AdminReasons />} />
            <Route path="zielgruppen" element={<AdminAudience />} />
            <Route path="preise" element={<AdminPricing />} />
            <Route path="faq" element={<AdminFAQ />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="einstellungen" element={<AdminSettings />} />
            {/* Legacy redirects */}
            <Route path="leads" element={<Navigate to="/admin/anfragen" replace />} />
            <Route path="inhalte" element={<Navigate to="/admin/einstellungen" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function CenterMsg({ text }: { text: string }) {
  return <div className="min-h-screen flex items-center justify-center text-muted-foreground">{text}</div>
}
function CenterCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background text-foreground">
      <div className="bg-card clean-border rounded-2xl p-8 max-w-md w-full elevated-shadow">{children}</div>
    </div>
  )
}

function SetupCodeForm({ onSubmit, onCancel }: { onSubmit: (code: string) => void; onCancel: () => void }) {
  const [code, setCode] = useState('')
  return (
    <>
      <p className="text-muted-foreground mb-6">Es existiert noch kein Admin. Bitte den Setup-Code eingeben, um diesen Account als Admin zu aktivieren.</p>
      <input type="text" placeholder="Setup-Code" value={code} onChange={e => setCode(e.target.value)}
        className="w-full px-4 py-3 rounded-md bg-background border border-border mb-4" />
      <div className="flex gap-3">
        <button onClick={() => onSubmit(code)} className="px-4 py-2 rounded-md bg-foreground text-background font-semibold">Als Admin aktivieren</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-md border border-border">Abmelden</button>
      </div>
    </>
  )
}

function AuthScreen({ adminExists }: { adminExists: boolean }) {
  const { toast } = useToast()
  const [mode, setMode] = useState<'login' | 'signup'>(adminExists ? 'login' : 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) toast({ title: 'Anmeldung fehlgeschlagen', description: error.message, variant: 'destructive' })
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } })
      if (error) toast({ title: 'Registrierung fehlgeschlagen', description: error.message, variant: 'destructive' })
      else toast({ title: 'Konto erstellt', description: 'Sie können sich jetzt anmelden.' })
    }
    setBusy(false)
  }

  return (
    <CenterCard>
      <h1 className="text-2xl font-black mb-2">Soul Cinema · Admin</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {adminExists ? 'Bitte melden Sie sich an.' : 'Erstmaliges Setup: Erstellen Sie das Admin-Konto. Anschließend wird der Setup-Code abgefragt.'}
      </p>
      <form onSubmit={submit} className="space-y-4">
        <input type="email" required placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)}
               className="w-full px-4 py-3 rounded-md bg-background border border-border" />
        <input type="password" required minLength={8} placeholder="Passwort (mind. 8 Zeichen)" value={password} onChange={e => setPassword(e.target.value)}
               className="w-full px-4 py-3 rounded-md bg-background border border-border" />
        <button type="submit" disabled={busy} className="w-full py-3 rounded-md bg-foreground text-background font-semibold disabled:opacity-60">
          {busy ? 'Bitte warten…' : mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
        </button>
      </form>
      {!adminExists && (
        <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="mt-4 text-sm text-muted-foreground hover:text-foreground">
          {mode === 'login' ? 'Konto erstellen' : 'Zur Anmeldung'}
        </button>
      )}
    </CenterCard>
  )
}
