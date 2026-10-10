interface TickerProps {
  items: string[]
}

export default function Ticker({ items }: TickerProps) {
  if (items.length === 0) return null

  const track = [...items, ...items]

  return (
    <div
      role="marquee"
      aria-label="Latest posts"
      className="glass-panel group mx-auto mt-3 max-w-7xl overflow-hidden rounded-full sm:mx-3 lg:mx-auto"
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap py-2.5 pl-6 group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-sm text-white/75">
            <span className="h-1 w-1 rounded-full bg-accent-from" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
