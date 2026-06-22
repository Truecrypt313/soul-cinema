'use client'

interface Props {
  className?: string
  /** SVG height in px (width scales automatically via viewBox). */
  size?: number
  title?: string
}

/**
 * Soul Cinema wordmark — pure SVG, theme-aware via currentColor.
 * "Soul" → editorial italic serif (Cormorant Garamond), warm + premium.
 * "CINEMA" → wider tracking, clean, cinematic.
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

      {/* Soul — editorial italic serif */}
      <text
        x="0"
        y="46"
        fill="currentColor"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 700,
          fontSize: '46px',
          letterSpacing: '0.01em',
          fontStyle: 'italic',
        }}
      >
        Soul
      </text>

      {/* Coral play-triangle accent + ice-blue spark */}
      <g transform="translate(112 20)">
        <polygon points="0,0 20,12 0,24" fill="var(--primary)" />
        <circle cx="27" cy="4" r="2.5" fill="var(--color-accent-blue)" />
      </g>

      {/* CINEMA — clean uppercase, cinematic tracking */}
      <text
        x="152"
        y="44"
        fill="currentColor"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: '28px',
          letterSpacing: '0.26em',
        }}
      >
        CINEMA
      </text>
    </svg>
  )
}

export default SoulCinemaWordmark
