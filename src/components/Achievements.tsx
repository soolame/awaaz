import { useRef, type ComponentType } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { EnrichedCreator } from '../lib/scoring'
import { BookIcon, PlacardIcon, FlameIcon, SignalIcon, CalendarIcon, SparkleIcon, type IconProps } from './icons'

gsap.registerPlugin(useGSAP)

const ACHIEVEMENTS: { name: string; Icon: ComponentType<IconProps> }[] = [
  { name: 'Explainer', Icon: BookIcon },
  { name: 'Showed up', Icon: PlacardIcon },
  { name: 'On a streak', Icon: FlameIcon },
  { name: 'Big reach', Icon: SignalIcon },
  { name: 'Consistent', Icon: CalendarIcon },
  { name: 'Broke format', Icon: SparkleIcon },
]

interface AchievementsProps {
  creators: EnrichedCreator[]
}

export default function Achievements({ creators }: AchievementsProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('.achievement-tile', {
        opacity: 0,
        scale: 0.6,
        y: 10,
        duration: 0.5,
        ease: 'back.out(2.4)',
        stagger: 0.07,
      })
    },
    { scope: gridRef },
  )

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-2">
      {ACHIEVEMENTS.map((achievement) => {
        const count = creators.filter((c) => c.badges.includes(achievement.name)).length
        const unlocked = count > 0
        return (
          <div
            key={achievement.name}
            className={`achievement-tile rounded-xl border px-2 py-2 text-center ${
              unlocked ? 'border-white/15 bg-white/5' : 'border-white/5 bg-white/[0.02] grayscale'
            }`}
          >
            <achievement.Icon className={`mx-auto h-5 w-5 ${unlocked ? 'text-accent-from' : 'text-white/40'}`} />
            <span className={`mt-1 block text-[10px] font-medium leading-tight ${unlocked ? 'text-white/75' : 'text-white/35'}`}>
              {achievement.name}
            </span>
            <span className={`block text-[10px] ${unlocked ? 'text-accent-from' : 'text-white/25'}`}>
              {count}/{creators.length}
            </span>
          </div>
        )
      })}
    </div>
  )
}
