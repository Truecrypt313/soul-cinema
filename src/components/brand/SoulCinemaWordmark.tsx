'use client'

interface Props {
  className?: string
  /** SVG height in px (width scales automatically via viewBox). */
  size?: number
  title?: string
}

/**
 * Soul Cinema wordmark — pure SVG, theme-aware via currentColor.
 * "SOUL" → editorial serif (Cormorant Garamond), warm + soft.
 * "CINEMA" → wider tracking, cleaner, cinematic.
 * Coral play-triangle + ice-blue spark as small brand accents.
 */
export function SoulCinemaWordmark({ className, size = 28, title = 'Soul Cinema' }: Props) {
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 360 64"
      height={size}
      width={(size * 360) / 64}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* SOUL — editorial serif */}
      <text
        x="0"
        y="46"
        fill="currentColor"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 600,
          fontSize: '46px',
          letterSpacing: '0.01em',
          fontStyle: 'italic',
        }}
      >
        Soul
      </text>

      {/* Coral play-triangle accent */}
      <g transform="translate(110 22)">
        <polygon points="0,0 16,10 0,20" fill="var(--primary)" />
        {/* tiny ice-blue spark */}
        <circle cx="22" cy="4" r="2" fill="var(--color-accent-blue)" />
      </g>

      {/* CINEMA — clean uppercase */}
      <text
        x="148"
        y="42"
        fill="currentColor"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: '26px',
          letterSpacing: '0.22em',
        }}
      >
        CINEMA
      </text>
    </svg>
  )
}

export default SoulCinemaWordmark
