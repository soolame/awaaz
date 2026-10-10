import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  children?: ReactNode
}

export default function FeatureCard({ icon, title, description, children }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <motion.span
          whileHover={{ rotate: -6 }}
          className="accent-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
        >
          {icon}
        </motion.span>
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-semibold text-white">{title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-white/60">{description}</p>
        </div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </motion.div>
  )
}
