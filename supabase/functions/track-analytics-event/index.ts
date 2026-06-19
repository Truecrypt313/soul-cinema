// Soul Cinema – First-party Analytics Ingest
// Privacy: no raw IP stored, no form contents, no fingerprinting.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const ALLOWED_EVENTS = new Set([
  'page_view',
  'cta_click',
  'pricing_cta_click',
  'contact_view',
  'contact_start',
  'contact_submit_success',
  'contact_submit_error',
  'external_link_click',
  'section_view',
  'faq_open',
])

const META_KEY_ALLOW = new Set([
  'package_slug', 'package_tier', 'target', 'error_code', 'cta_label', 'faq_id', 'faq_index',
])

const BOT_UA = /(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|whatsapp|telegrambot|skypeuripreview|nuzzel|discordbot|google|yandex|baiduspider|duckduck|semrush|ahrefs|mj12|petal|headless|phantomjs|puppeteer|lighthouse|preview)/i

const Payload = z.object({
  event_name: z.string().min(1).max(64),
  page_path: z.string().max(256).optional(),
  section_key: z.string().max(64).optional(),
  cta_id: z.string().max(64).optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  session_id: z.string().max(64).optional(),
  viewport_w: z.number().int().min(0).max(10000).optional(),
  device_type: z.enum(['mobile', 'desktop', 'tablet']).optional(),
  theme: z.enum(['dark', 'light']).optional(),
  referrer: z.string().max(512).optional(),
  utm: z.object({
    source: z.string().max(120).optional(),
    medium: z.string().max(120).optional(),
    campaign: z.string().max(120).optional(),
    content: z.string().max(120).optional(),
    term: z.string().max(120).optional(),
  }).optional(),
  ua: z.string().max(512).optional(),
})

function bucketViewport(w?: number): string | null {
  if (!w) return null
  if (w < 480) return 'xs'
  if (w < 768) return 'sm'
  if (w < 1024) return 'md'
  if (w < 1440) return 'lg'
  return 'xl'
}

function browserName(ua: string): string {
  const u = ua.toLowerCase()
  if (u.includes('edg/')) return 'Edge'
  if (u.includes('opr/') || u.includes('opera')) return 'Opera'
  if (u.includes('firefox')) return 'Firefox'
  if (u.includes('chrome')) return 'Chrome'
  if (u.includes('safari')) return 'Safari'
  return 'Other'
}
function osName(ua: string): string {
  const u = ua.toLowerCase()
  if (u.includes('iphone') || u.includes('ipad') || u.includes('ios')) return 'iOS'
  if (u.includes('android')) return 'Android'
  if (u.includes('mac os')) return 'macOS'
  if (u.includes('windows')) return 'Windows'
  if (u.includes('linux')) return 'Linux'
  return 'Other'
}
function refDomain(ref?: string): string | null {
  if (!ref) return null
  try { return new URL(ref).hostname.replace(/^www\./, '') } catch { return null }
}

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// in-memory rate limit (best-effort per instance)
const RATE = new Map<string, { count: number; reset: number }>()
function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const e = RATE.get(key)
  if (!e || now > e.reset) { RATE.set(key, { count: 1, reset: now + windowMs }); return true }
  e.count++
  return e.count <= max
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method === 'GET') {
    const saltSet = !!Deno.env.get('ANALYTICS_SALT')
    return new Response(JSON.stringify({ ok: true, salt_configured: saltSet }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  let body: unknown
  try { body = await req.json() } catch { return new Response('bad json', { status: 400, headers: corsHeaders }) }
  const parsed = Payload.safeParse(body)
  if (!parsed.success) return new Response('invalid', { status: 400, headers: corsHeaders })
  const p = parsed.data

  if (!ALLOWED_EVENTS.has(p.event_name)) { console.log('drop:not-allowed', p.event_name); return new Response(null, { status: 204, headers: corsHeaders }) }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  // settings
  const { data: settings, error: sErr } = await supabase.from('analytics_settings').select('*').eq('id', 1).maybeSingle()
  if (sErr) console.log('settings error', sErr.message)
  if (!settings) { console.log('drop:no-settings'); return new Response(null, { status: 204, headers: corsHeaders }) }
  if (settings.analytics_enabled === false) { console.log('drop:disabled'); return new Response(null, { status: 204, headers: corsHeaders }) }

  // per-event toggles
  const ev = p.event_name
  if (ev === 'page_view' && !settings.track_page_views) { console.log('drop:pv-off'); return new Response(null, { status: 204, headers: corsHeaders }) }
  if ((ev === 'cta_click' || ev === 'pricing_cta_click' || ev === 'external_link_click') && !settings.track_cta_clicks) { console.log('drop:cta-off'); return new Response(null, { status: 204, headers: corsHeaders }) }
  if ((ev === 'contact_view' || ev === 'contact_start' || ev === 'contact_submit_success' || ev === 'contact_submit_error') && !settings.track_form_events) { console.log('drop:form-off'); return new Response(null, { status: 204, headers: corsHeaders }) }
  if ((ev === 'section_view' || ev === 'faq_open') && !settings.track_section_views) { console.log('drop:section-off', settings.track_section_views); return new Response(null, { status: 204, headers: corsHeaders }) }

  const ua = p.ua ?? req.headers.get('user-agent') ?? ''
  if (settings.bot_filter_enabled && BOT_UA.test(ua)) return new Response(null, { status: 204, headers: corsHeaders })

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'na'
  const today = new Date().toISOString().slice(0, 10)
  const salt = Deno.env.get('ANALYTICS_SALT') ?? 'sc-default-salt'
  const visitor_hash = await sha256(`${salt}|${today}|${ip}|${ua}`)

  if (!rateLimit(visitor_hash, 60, 60_000) || !rateLimit(`h:${visitor_hash}`, 600, 3_600_000)) {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  // whitelist metadata
  let metaClean: Record<string, unknown> = {}
  if (p.metadata) {
    for (const [k, v] of Object.entries(p.metadata)) {
      if (META_KEY_ALLOW.has(k) && typeof v !== 'object') metaClean[k] = typeof v === 'string' ? v.slice(0, 200) : v
    }
  }

  const row = {
    event_name: ev,
    page_path: p.page_path?.slice(0, 256) ?? null,
    section_key: p.section_key ?? null,
    cta_id: p.cta_id ?? null,
    metadata: metaClean,
    visitor_hash,
    session_hash: p.session_id ? await sha256(`${salt}|${p.session_id}`) : null,
    device_type: settings.track_device ? (p.device_type ?? null) : null,
    viewport_bucket: settings.track_device ? bucketViewport(p.viewport_w) : null,
    browser_name: settings.track_device ? browserName(ua) : null,
    os_name: settings.track_device ? osName(ua) : null,
    referrer_domain: settings.track_referrers ? refDomain(p.referrer) : null,
    utm_source: settings.track_referrers ? (p.utm?.source ?? null) : null,
    utm_medium: settings.track_referrers ? (p.utm?.medium ?? null) : null,
    utm_campaign: settings.track_referrers ? (p.utm?.campaign ?? null) : null,
    utm_content: settings.track_referrers ? (p.utm?.content ?? null) : null,
    utm_term: settings.track_referrers ? (p.utm?.term ?? null) : null,
    theme: settings.track_theme ? (p.theme ?? null) : null,
  }

  const { error } = await supabase.from('analytics_events').insert(row)
  if (error) {
    console.error('insert error', error.message, ev)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  return new Response(null, { status: 204, headers: corsHeaders })
})
