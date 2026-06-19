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
const ATTR_KEY = 'sc_attr'
const INTEREST_KEY = 'sc_interest_pkg'

export type LeadAttribution = {
  referrer_domain?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  landing_page?: string
  device_type?: string
}

function refDomain(): string | undefined {
  try {
    if (!document.referrer) return undefined
    const host = new URL(document.referrer).hostname
    if (!host || host === window.location.hostname) return undefined
    return host.slice(0, 200)
  } catch { return undefined }
}

/** Capture attribution once per tab/session. Subsequent calls return the stored snapshot. */
export function captureAttribution(): LeadAttribution {
  if (typeof window === 'undefined') return {}
  try {
    const existing = sessionStorage.getItem(ATTR_KEY)
    if (existing) return JSON.parse(existing) as LeadAttribution
  } catch {}

  const utm = readUtmFromUrl() || {}
  const attr: LeadAttribution = {
    referrer_domain: refDomain(),
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    utm_content: utm.content,
    utm_term: utm.term,
    landing_page: (window.location.pathname + window.location.search).slice(0, 500),
    device_type: deviceType(),
  }
  try { sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr)) } catch {}
  return attr
}

export function getAttribution(): LeadAttribution {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(ATTR_KEY)
    if (raw) return JSON.parse(raw) as LeadAttribution
  } catch {}
  return captureAttribution()
}

export function setInterestPackage(slug: string) {
  try { sessionStorage.setItem(INTEREST_KEY, slug.slice(0, 80)) } catch {}
}
export function getInterestPackage(): string | undefined {
  try { return sessionStorage.getItem(INTEREST_KEY) || undefined } catch { return undefined }
}

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
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export type TrackInput = {
  event_name:
    | 'page_view' | 'cta_click' | 'pricing_cta_click'
    | 'contact_view' | 'contact_start' | 'contact_submit_success' | 'contact_submit_error'
    | 'external_link_click' | 'section_view' | 'faq_open'
  section_key?: string
  cta_id?: string
  metadata?: Record<string, string | number | boolean>
}

let bootstrapped = false
function bootstrap() {
  if (bootstrapped) return
  bootstrapped = true
  // capture utm + attribution on first load (per tab/session)
  try { readUtmFromUrl() } catch {}
  try { captureAttribution() } catch {}
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

// --- Content insights helpers (Phase B) ---

const SECTION_SEEN = new Set<string>()

export function trackFaqOpen(faqId: string, index?: number) {
  track({
    event_name: 'faq_open',
    section_key: 'faq',
    metadata: { faq_id: faqId.slice(0, 64), ...(typeof index === 'number' ? { faq_index: index } : {}) },
  })
}

/**
 * Observe all <section data-section="key"> elements on the page.
 * Fires `section_view` once per session per section after ≥1s of ≥50% visibility.
 */
export function observeSectionViews(): () => void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return () => {}
  if (dntOn()) return () => {}

  const timers = new Map<Element, number>()

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement
      const key = el.dataset.section || el.id
      if (!key || SECTION_SEEN.has(key)) continue

      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        if (!timers.has(el)) {
          const t = window.setTimeout(() => {
            if (SECTION_SEEN.has(key)) return
            SECTION_SEEN.add(key)
            track({ event_name: 'section_view', section_key: key })
            io.unobserve(el)
            timers.delete(el)
          }, 1000)
          timers.set(el, t)
        }
      } else {
        const t = timers.get(el)
        if (t) { clearTimeout(t); timers.delete(el) }
      }
    }
  }, { threshold: [0, 0.5, 1] })

  const targets = document.querySelectorAll<HTMLElement>('section[data-section], section[id]')
  targets.forEach((el) => io.observe(el))

  return () => {
    timers.forEach((t) => clearTimeout(t))
    timers.clear()
    io.disconnect()
  }
}
