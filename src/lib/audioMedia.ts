import { supabase } from '@/integrations/supabase/client'

const BUCKET = 'portfolio-media'
const SIGNED_TTL = 60 * 60 * 24 * 7 // 7 days

/**
 * Robust parser for site_settings boolean values.
 * Accepts true/false, "true"/"false", 1/0, "1"/"0", "yes"/"no".
 */
export function parseBool(v: unknown, fallback = false): boolean {
  if (v === true || v === false) return v
  if (typeof v === 'number') return v !== 0
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    if (['true', '1', 'yes', 'on'].includes(s)) return true
    if (['false', '0', 'no', 'off', ''].includes(s)) return false
  }
  return fallback
}

/** Parse + clamp a volume value to [0..1]. */
export function parseVolume(v: unknown, fallback = 0.35): number {
  let n: number | null = null
  if (typeof v === 'number') n = v
  else if (typeof v === 'string' && v.trim() !== '') {
    const parsed = parseFloat(v.replace(',', '.'))
    if (!Number.isNaN(parsed)) n = parsed
  }
  if (n === null || Number.isNaN(n)) n = fallback
  if (n < 0) n = 0
  if (n > 1) n = 1
  return n
}

/**
 * Resolves an audio reference (URL or storage path) to a playable URL.
 *  - empty -> null
 *  - http(s):// -> unchanged
 *  - /something (e.g. /media/audio/x.mp3) -> unchanged
 *  - audio/..., music/..., sounds/... or other relative -> signed URL from `portfolio-media`
 *
 * Async because storage paths require a signed URL.
 */
export async function resolveAudioUrl(
  pathOrUrl: string | null | undefined,
): Promise<string | null> {
  if (!pathOrUrl) return null
  const v = pathOrUrl.trim()
  if (!v) return null
  if (/^https?:\/\//i.test(v)) return v
  if (v.startsWith('/')) return v
  try {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(v, SIGNED_TTL)
    if (error || !data?.signedUrl) {
      console.warn('[audioMedia] signed URL failed', { path: v, error: error?.message })
      return null
    }
    return data.signedUrl
  } catch (e: any) {
    console.warn('[audioMedia] unexpected error', { path: v, error: e?.message ?? String(e) })
    return null
  }
}
