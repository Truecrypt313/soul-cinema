'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

type Variant = 'glass' | 'plain'

export function ThemeToggle({
  variant = 'plain',
  className = '',
}: {
  variant?: Variant
  className?: string
}) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const base =
    'inline-flex items-center justify-center w-9 h-9 rounded-full gentle-animation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0'

  const styles =
    variant === 'glass'
      ? 'glass-effect text-foreground hover:text-primary'
      : 'border border-border bg-card text-foreground hover:text-primary hover:border-primary/40'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Auf helles Theme wechseln' : 'Auf dunkles Theme wechseln'}
      title="Theme wechseln"
      className={`${base} ${styles} ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="sr-only">Theme wechseln</span>
    </button>
  )
}
