import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const COLORS = ['#ff6fb5', '#ff8a4c', '#ffd76a', '#8b5cf6', '#5aa9ff', '#2dd9c2']

interface Particle {
  id: number
  x: number
  y: number
  rotate: number
  delay: number
  color: string
  size: number
}

/** Deterministic pseudo-random in [0, 1), seeded by index — avoids Math.random during render. */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (pseudoRandom(i + 1) - 0.5) * 220,
    y: 160 + pseudoRandom(i + 101) * 60,
    rotate: pseudoRandom(i + 201) * 360,
    delay: pseudoRandom(i + 301) * 0.3,
    color: COLORS[i % COLORS.length],
    size: 5 + pseudoRandom(i + 401) * 5,
  }))
}

interface ConfettiProps {
  active: boolean
  pieces?: number
}

export default function Confetti({ active, pieces = 28 }: ConfettiProps) {
  const reduceMotion = useReducedMotion()
  const particles = useMemo(() => generateParticles(pieces), [pieces])

  if (!active || reduceMotion) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 z-30 h-0 w-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size * 0.4, background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1.4, delay: 0.9 + p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
