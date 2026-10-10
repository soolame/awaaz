import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { formatDateLong } from '../format'
import { MegaphoneIcon } from './icons'

const NAV_ITEMS = [
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'waiting', label: 'Waiting list' },
  { id: 'how-it-works', label: 'How it works' },
]

export default function TopBar({ updatedAt }: { updatedAt: string }) {
  const [active, setActive] = useState('leaderboard')

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      className="sticky top-0 z-40 glass-panel mx-auto mt-3 flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:mx-3 lg:mx-auto"
    >
      <a href="#top" className="flex items-center gap-2.5">
        <span className="accent-gradient flex h-10 w-10 items-center justify-center rounded-xl text-black/80 shadow-[0_6px_18px_rgba(255,111,181,0.35)]">
          <MegaphoneIcon className="h-5 w-5" />
        </span>
        <span className="font-heading text-xl font-bold tracking-tight">Awaaz</span>
      </a>

      <nav
        aria-label="Primary"
        className="order-3 flex w-full justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 sm:order-2 sm:w-auto"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActive(item.id)}
            className="relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:px-4"
          >
            {active === item.id && (
              <motion.span
                layoutId="nav-active-pill"
                className="accent-gradient absolute inset-0 rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${active === item.id ? 'text-black/90' : 'text-white/75 hover:text-white'}`}>
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      <div className="order-2 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 sm:order-3">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        Live, updated {formatDateLong(updatedAt)}
      </div>
    </motion.header>
  )
}
