import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5.5A2.5 2.5 0 0 0 8 9.5M16 5h2.5A2.5 2.5 0 0 1 16 9.5" />
      <path d="M12 13v4M9 20h6M10 17h4" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

export function MicIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9.5" y="3" width="5" height="10" rx="2.5" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    </svg>
  )
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base({ fill: 'currentColor', stroke: 'none', ...props })}>
      <path d="M13.2 2c.4 2.6-.7 4-2.1 5.4C9.4 9 7.5 10.6 7.5 13.6A6.5 6.5 0 0 0 14 20a6 6 0 0 0 6-6.1c0-3.4-2.2-5.2-3.6-7.2-.4 1-1 1.7-1.8 2.2.5-2.9-.3-5.3-1.4-6.9Z" />
      <path
        d="M10.4 14.2c0-1.4.9-2.2 1.7-3 .5 1.6 1.9 2 1.9 3.6a1.9 1.9 0 0 1-3.6.6c-.1-.4 0-.8 0-1.2Z"
        fill="#000"
        opacity=".22"
      />
    </svg>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4V5.5Z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6V5.5Z" />
    </svg>
  )
}

export function BookmarkIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base({ fill: filled ? 'currentColor' : 'none', ...props })}>
      <path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.4L5.5 20.5v-16a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9.5 5.5 7 6.5-7 6.5" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5" />
    </svg>
  )
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base({ fill: 'currentColor', stroke: 'none', ...props })}>
      <path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5Z" />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8.5Z" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  )
}

export function PlanetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="11" r="5.5" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="13" rx="10.5" ry="3.6" transform="rotate(-20 12 13)" />
    </svg>
  )
}

export function PlusSquareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </svg>
  )
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 11.5C4 7.9 7.6 5 12 5s8 2.9 8 6.5S16.4 18 12 18c-.8 0-1.6-.1-2.3-.3L5.5 19.5l.9-3A6.4 6.4 0 0 1 4 11.5Z" />
      <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" strokeWidth="2.4" />
    </svg>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
    </svg>
  )
}
