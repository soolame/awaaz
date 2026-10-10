import type { SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement>

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

/** Level 1 — First words: a seedling. */
export function SproutIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21v-9" />
      <path d="M12 12c0-3.6-2.5-5.6-6.5-5.8 0 4 2.9 5.8 6.5 5.8Z" />
      <path d="M12 10c0-2.8 2-4.6 5.5-4.8 0 3-2 4.8-5.5 4.8Z" />
    </Base>
  )
}

/** Level 2 — Steady voice: a speech bubble. */
export function SpeechIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9.5L5 19v-3.5H6a2 2 0 0 1-2-2v-7Z" />
    </Base>
  )
}

/** Level 3 — Amplifier, and the brand mark: a megaphone. */
export function MegaphoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 10.2v3.6a1 1 0 0 0 1 1h1.8l5.7 4V5.2l-5.7 4H4a1 1 0 0 0-1 1Z" />
      <path d="M14.5 9a4 4 0 0 1 0 6" />
      <path d="M17.3 6.3a8 8 0 0 1 0 11.4" />
    </Base>
  )
}

/** Level 4 — Torchbearer; also "on a streak": a flame. */
export function FlameIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21.5c3.9 0 6.8-2.6 6.8-6.6 0-2.8-1.5-4.6-2.8-6.1.2 1.9-.9 2.8-1.6 2.8-.9 0-1-3.6-3.4-6.1.4 2.8-1 4.5-2.7 6.5-1.5 1.8-2.8 3.5-2.8 5.6 0 4 2.8 6.6 5.6 6.6Z" />
      <path d="M12 21.5c1.7 0 3-1.2 3-3 0-1.6-1.1-2.5-1.8-3.4.1 1-.5 1.5-1 1.5-.6 0-.4-1.8-1.6-2.9 0 1.4-.8 2.2-1.4 3-.6.8-1.2 1.6-1.2 2.6 0 1.9 1.4 3.2 3 3.2Z" fill="currentColor" stroke="none" opacity="0.35" />
    </Base>
  )
}

/** Achievement — Explainer: an open book. */
export function BookIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 6.3c-1.7-1.3-3.9-2-6-2v12.4c2.1 0 4.3.7 6 2 1.7-1.3 3.9-2 6-2V4.3c-2.1 0-4.3.7-6 2Z" />
      <path d="M12 6.3v12.4" />
    </Base>
  )
}

/** Achievement — Showed up: a placard. */
export function PlacardIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="4" width="15" height="9" rx="1.5" />
      <path d="M8 13v6.5" />
      <path d="M8 19.5h3" />
    </Base>
  )
}

/** Achievement — Big reach: a broadcast signal. */
export function SignalIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 20v-5.5" />
      <circle cx="12" cy="13" r="2" />
      <path d="M8.8 11.3a4.6 4.6 0 0 1 6.4 0" />
      <path d="M6 8.5a8.5 8.5 0 0 1 12 0" />
    </Base>
  )
}

/** Achievement — Consistent: a calendar. */
export function CalendarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9.5h16" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
    </Base>
  )
}

/** Achievement — Broke format: a sparkle. */
export function SparkleIcon(props: IconProps) {
  return (
    <Base {...props} fill="currentColor" stroke="none">
      <path d="M12 3c.6 3.5 2.6 5.5 6 6-3.4.6-5.4 2.6-6 6-.6-3.5-2.6-5.5-6-6 3.4-.5 5.4-2.5 6-6Z" />
    </Base>
  )
}

/** Unlock achievements, and the badge fallback: a medal. */
export function MedalIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8.5 4 10.8 10" />
      <path d="M15.5 4 13.2 10" />
      <circle cx="12" cy="15" r="5" />
      <path d="M12 12.5v1.6l1.4.9-1.4.9v1.6" />
    </Base>
  )
}

/** Feature — Track public posts: a newspaper. */
export function NewspaperIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
      <path d="M3.5 9.3h17" />
      <path d="M7.5 13h4" />
      <path d="M7.5 16h4" />
      <path d="M14.5 13h3" />
      <path d="M14.5 16h3" />
    </Base>
  )
}

/** Feature — Score by depth: ascending bars. */
export function BarsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5.5 19v-7.5" />
      <path d="M12 19V5.5" />
      <path d="M18.5 19v-5.5" />
    </Base>
  )
}

/** Feature — Substance, not stance: a balance scale. */
export function ScaleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.5v16.5" />
      <path d="M9 20h6" />
      <path d="M5 7.5h14" />
      <path d="M8 7.5 4.5 14a3.5 3.5 0 0 0 7 0L8 7.5Z" />
      <path d="M16 7.5 12.5 14a3.5 3.5 0 0 0 7 0L16 7.5Z" />
    </Base>
  )
}

/** Feature — Submit a post: a pen. */
export function PenIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.5 19.5 5.3 15.4 14.8 5.9a2 2 0 0 1 2.8 0l1 1a2 2 0 0 1 0 2.8L9.1 19.2l-4.1.8Z" />
      <path d="M13 7.7l3.3 3.3" />
    </Base>
  )
}

/** Toast: a trophy. */
export function TrophyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 4.5h8v4a4 4 0 0 1-8 0v-4Z" />
      <path d="M8 5.5H5.3A2.8 2.8 0 0 0 8 9.8" />
      <path d="M16 5.5h2.7A2.8 2.8 0 0 1 16 9.8" />
      <path d="M12 12.5v3.5" />
      <path d="M9.3 20h5.4l-.5-3.5h-4.4L9.3 20Z" />
    </Base>
  )
}

/** Waiting list: a muted microphone. */
export function MicOffIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9.5 5.8A2.5 2.5 0 0 1 14.5 7v3.2M14.5 13.8V14a2.5 2.5 0 0 1-3.7 2.2" />
      <path d="M5.5 11a6.5 6.5 0 0 0 1.2 3.8" />
      <path d="M18.5 11a6.5 6.5 0 0 1-1 3.5" />
      <path d="M12 17.5v3" />
      <path d="M9 20.5h6" />
      <path d="M3.5 3.5l17 17" />
    </Base>
  )
}

/** Issue card: a ballot going into a box. */
export function BallotIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="10" width="16" height="10" rx="1.5" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      <path d="M9.5 14 12 16.3 15 13" />
    </Base>
  )
}

/** Background floater: a microphone. */
export function MicIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5v3" />
      <path d="M9 20.5h6" />
    </Base>
  )
}

/** Background floater: a raised fist. */
export function FistIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7.5 11.2V9a1.5 1.5 0 0 1 3 0v-1a1.5 1.5 0 0 1 3 0v-.8a1.5 1.5 0 0 1 3 0v2.5" />
      <path d="M16.5 10.8a1.5 1.5 0 0 1 3 0v2.7a5 5 0 0 1-5 5h-1.3a5 5 0 0 1-5-5v-2l-1.3-1.7a1.2 1.2 0 0 1 1.9-1.5l1.4 1.5" />
    </Base>
  )
}
