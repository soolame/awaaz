import { motion, useReducedMotion } from 'framer-motion'
import { MegaphoneIcon, MicIcon, FistIcon, type IconProps } from './icons'
import type { ComponentType } from 'react'

interface Blob {
  className: string
  color: string
  animate: 'animate-blob-1' | 'animate-blob-2'
}

const BLOBS: Blob[] = [
  { className: 'left-[-10%] top-[-10%] h-[36rem] w-[36rem]', color: '#7c3aed', animate: 'animate-blob-1' },
  { className: 'right-[-15%] top-[5%] h-[32rem] w-[32rem]', color: '#ff8a4c', animate: 'animate-blob-2' },
  { className: 'left-[20%] top-[60%] h-[30rem] w-[30rem]', color: '#ff6fb5', animate: 'animate-blob-1' },
  { className: 'right-[5%] bottom-[-15%] h-[34rem] w-[34rem]', color: '#3b82f6', animate: 'animate-blob-2' },
]

const FLOATERS: { Icon: ComponentType<IconProps>; className: string; delay: number }[] = [
  { Icon: MegaphoneIcon, className: 'left-[2%] top-[14%]', delay: 0 },
  { Icon: MicIcon, className: 'right-[3%] top-[30%]', delay: 1.2 },
  { Icon: FistIcon, className: 'left-[4%] bottom-[12%]', delay: 2.1 },
]

export default function Background() {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-base" />
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-40 blur-3xl ${blob.className} ${reduceMotion ? '' : blob.animate}`}
          style={{ background: blob.color }}
        />
      ))}
      <div className="absolute inset-0 bg-base-deep/40" />

      <div className="hidden sm:block">
        {FLOATERS.map((f, i) => (
          <motion.div
            key={i}
            className={`absolute ${f.className} ${reduceMotion ? '' : 'animate-float-bob'}`}
            style={{ '--bob-rot': i % 2 ? '5deg' : '-5deg' } as React.CSSProperties}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 + f.delay }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
              <f.Icon className="h-6 w-6" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
