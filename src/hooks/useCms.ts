import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

type AnyRow = Record<string, any>

export function useCmsList<T = AnyRow>(table: string, fallback: T[]): T[] {
  const [rows, setRows] = useState<T[]>(fallback)
  useEffect(() => {
    let active = true
    ;(async () => {
      const { data, error } = await (supabase as any)
        .from(table)
        .select('*')
        .eq('visible', true)
        .order('sort_order', { ascending: true })
      if (!active) return
      if (!error && data && data.length) setRows(data as T[])
    })()
    return () => { active = false }
  }, [table])
  return rows
}

export function useSettings(): Record<string, any> {
  const [map, setMap] = useState<Record<string, any>>({})
  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.from('site_settings').select('key,value')
      if (!active || !data) return
      const m: Record<string, any> = {}
      for (const r of data as any[]) m[r.key] = r.value
      setMap(m)
    })()
    return () => { active = false }
  }, [])
  return map
}

export function setting<T = any>(map: Record<string, any>, key: string, fallback: T): T {
  const v = map[key]
  if (v === undefined || v === null || v === '') return fallback
  return v as T
}
