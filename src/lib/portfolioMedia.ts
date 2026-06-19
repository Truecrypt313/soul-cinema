import { supabase } from '@/integrations/supabase/client'

const BUCKET = 'portfolio-media'
const SIGNED_TTL = 60 * 60 * 24 * 7 // 7 days

/**
 * Resolves a portfolio media reference to a usable URL.
 * Supports:
 *  - empty/null -> null
 *  - http(s)://... -> unchanged
 *  - /something (e.g. /media/portfolio/foo.mp4) -> unchanged
 *  - Supabase Storage path (e.g. videos/uuid.mp4, thumbs/...) -> signed URL from `portfolio-media`
 *
 * Never writes back to the DB. Resolution is runtime only.
 */
export async function resolvePortfolioMediaUrl(
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
      console.warn('[portfolioMedia] signed URL failed', {
        bucket: BUCKET,
        path: v,
        error: error?.message ?? 'no signedUrl returned',
      })
      return null
    }
    return data.signedUrl
  } catch (e: any) {
    console.warn('[portfolioMedia] unexpected error', {
      bucket: BUCKET,
      path: v,
      error: e?.message ?? String(e),
    })
    return null
  }
}

/** Resolve many at once; returns a map from raw value -> resolved url (or null). */
export async function resolveMany(
  values: Array<string | null | undefined>,
): Promise<Record<string, string | null>> {
  const unique = Array.from(new Set(values.filter((v): v is string => !!v && !!v.trim())))
  const out: Record<string, string | null> = {}
  await Promise.all(
    unique.map(async (v) => {
      out[v] = await resolvePortfolioMediaUrl(v)
    }),
  )
  return out
}
