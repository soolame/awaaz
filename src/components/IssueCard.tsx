import { formatDateLong } from '../format'

interface IssueCardProps {
  issue: string
  updatedAt: string
  spoke: number
  total: number
}

export default function IssueCard({ issue, updatedAt, spoke, total }: IssueCardProps) {
  return (
    <div className="glass-panel rounded-[22px] p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="accent-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl">
          🗳️
        </span>
        <span className="rounded-full border border-accent-from/40 px-2.5 py-1 text-[11px] font-semibold text-accent-from">
          Voices {spoke}/{total}
        </span>
      </div>
      <h2 className="mt-3 font-heading text-base font-bold leading-snug text-white">{issue}</h2>
      <p className="mt-1 text-xs text-white/55">Last updated {formatDateLong(updatedAt)}</p>
    </div>
  )
}
