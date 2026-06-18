import * as LucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

export function Icon({ name, ...props }: { name?: string | null } & LucideProps) {
  const Cmp = (name && (LucideIcons as any)[name]) || LucideIcons.Sparkles
  return <Cmp {...props} />
}
