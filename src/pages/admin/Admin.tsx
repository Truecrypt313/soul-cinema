'use client'

import { useEffect, useState } from 'react'
import { Link, Route, Routes, Navigate, useNavigate, NavLink } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import type { Session, User } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'
import AdminLeads from './AdminLeads'
import AdminPortfolio from './AdminPortfolio'
import AdminSettings from './AdminSettings'

type AuthState = 'loading' | 'guest' | 'authenticated'

export default function Admin() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminExists, setAdminExists] = useState<boolean>(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      handleSession(session)
    })
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
    const { data: roleData } = await supabase
      .from('user_roles').select('role').eq('user_id', session.user.id).eq('role', 'admin').maybeSingle()
    setIsAdmin(Boolean(roleData))
    const { data: exists } = await supabase.rpc('admin_exists')
    setAdminExists(Boolean(exists))
    setAuthState('authenticated')
  }

  const claimAdmin = async () => {
    const { data, error } = await supabase.rpc('claim_admin')
    if (error || !data) {
      toast({ title: 'Admin-Setup fehlgeschlagen', description: 'Möglicherweise existiert bereits ein Admin.', variant: 'destructive' })
      return
    }
    setIsAdmin(true); setAdminExists(true)
    toast({ title: 'Admin-Zugang aktiviert' })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (authState === 'loading') {
    return <CenterMsg text="Lade…" />
  }

  if (authState === 'guest') {
    return <AuthScreen adminExists={adminExists} />
  }

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
          <>
            <p className="text-muted-foreground mb-6">Es existiert noch kein Admin. Diesen Account jetzt als Admin freischalten?</p>
            <div className="flex gap-3">
              <button onClick={claimAdmin} className="px-4 py-2 rounded-md bg-foreground text-background font-semibold">Als Admin aktivieren</button>
              <button onClick={signOut} className="px-4 py-2 rounded-md border border-border">Abmelden</button>
            </div>
          </>
        )}
      </CenterCard>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-bagel text-xl">Soul Cinema · Admin</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavTab to="/admin/leads">Anfragen</NavTab>
            <NavTab to="/admin/portfolio">Portfolio</NavTab>
            <NavTab to="/admin/inhalte">Inhalte</NavTab>
            <button onClick={signOut} className="text-muted-foreground hover:text-foreground">Abmelden</button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10">
        <Routes>
          <Route index element={<Navigate to="leads" replace />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="inhalte" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  )
}

function NavTab({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md font-medium ${isActive ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`
      }
    >
      {children}
    </NavLink>
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      })
      if (error) toast({ title: 'Registrierung fehlgeschlagen', description: error.message, variant: 'destructive' })
      else toast({ title: 'Konto erstellt', description: 'Sie können sich jetzt anmelden.' })
    }
    setBusy(false)
  }

  return (
    <CenterCard>
      <h1 className="text-2xl font-black mb-2">Soul Cinema · Admin</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {adminExists ? 'Bitte melden Sie sich an.' : 'Erstmaliges Setup: Erstellen Sie das Admin-Konto.'}
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
