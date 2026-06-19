// Soul Cinema – Privacy-friendly client tracker
// Sends events to the track-analytics-event edge function via sendBeacon / keepalive fetch.
// Respects DoNotTrack. No cookies, no localStorage. Per-tab sessionStorage random id only.

type Utm = { source?: string; medium?: string; campaign?: string; content?: string; term?: string }

const PROJECT_ID = (import.meta as any).env?.VITE_SUPABASE_PROJECT_ID as string | undefined
const ENDPOINT = PROJECT_ID
  ? `https://${PROJECT_ID}.supabase.co/functions/v1/track-analytics-event`
  : '/_track-disabled'

const SESSION_KEY = 'sc_sid'
const UTM_KEY = 'sc_utm'

function dntOn(): boolean {
  if (typeof navigator === 'undefined') return false
  const v = (navigator as any).doNotTrack ?? (window as any).doNotTrack
  return v === '1' || v === 'yes'
}

function getSessionId(): string {
  if (typeof sessionStorage === 'undefined') return ''
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36))
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function deviceType(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

function readUtmFromUrl(): Utm | undefined {
  if (typeof window === 'undefined') return undefined
  const u = new URL(window.location.href)
  const utm: Utm = {}
  const map: [string, keyof Utm][] = [
    ['utm_source', 'source'], ['utm_medium', 'medium'], ['utm_campaign', 'campaign'],
    ['utm_content', 'content'], ['utm_term', 'term'],
  ]
  for (const [k, key] of map) {
    const v = u.searchParams.get(k)
    if (v) utm[key] = v.slice(0, 120)
  }
  if (Object.keys(utm).length === 0) return undefined
  try { sessionStorage.setItem(UTM_KEY, JSON.stringify(utm)) } catch {}
  return utm
}

function getUtm(): Utm | undefined {
  const fresh = readUtmFromUrl()
  if (fresh) return fresh
  try {
    const raw = sessionStorage.getItem(UTM_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return undefined
}

function getTheme(): 'dark' | 'light' {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

export type TrackInput = {
  event_name:
    | 'page_view' | 'cta_click' | 'pricing_cta_click'
    | 'contact_view' | 'contact_start' | 'contact_submit_success' | 'contact_submit_error'
    | 'external_link_click'
  section_key?: string
  cta_id?: string
  metadata?: Record<string, string | number | boolean>
}

let bootstrapped = false
function bootstrap() {
  if (bootstrapped) return
  bootstrapped = true
  // capture utm on first load
  try { readUtmFromUrl() } catch {}
}

export function track(input: TrackInput): void {
  try {
    if (typeof window === 'undefined') return
    if (dntOn()) return
    if (!PROJECT_ID) return
    bootstrap()

    const payload = {
      ...input,
      page_path: window.location.pathname,
      session_id: getSessionId(),
      viewport_w: window.innerWidth,
      device_type: deviceType(),
      theme: getTheme(),
      referrer: document.referrer || undefined,
      utm: getUtm(),
    }

    const body = JSON.stringify(payload)
    // Prefer sendBeacon; fall back to fetch keepalive
    let sent = false
    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([body], { type: 'application/json' })
        sent = navigator.sendBeacon(ENDPOINT, blob)
      } catch {}
    }
    if (!sent) {
      fetch(ENDPOINT, {
        method: 'POST', body, keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {})
    }
  } catch {
    // never throw from tracking
  }
}

export function trackPageView() {
  track({ event_name: 'page_view' })
}
