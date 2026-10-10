import type { EnrichedCreator } from '../lib/scoring'

const ACHIEVEMENTS: { name: string; icon: string }[] = [
  { name: 'Explainer', icon: '📖' },
  { name: 'Showed up', icon: '🪧' },
  { name: 'On a streak', icon: '🔥' },
  { name: 'Big reach', icon: '📡' },
  { name: 'Consistent', icon: '🗓️' },
  { name: 'Broke format', icon: '🎭' },
]

interface AchievementsProps {
  creators: EnrichedCreator[]
}

export default function Achievements({ creators }: AchievementsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {ACHIEVEMENTS.map((achievement) => {
        const count = creators.filter((c) => c.badges.includes(achievement.name)).length
        const unlocked = count > 0
        return (
          <div
            key={achievement.name}
            className={`rounded-xl border px-2 py-2 text-center ${
              unlocked ? 'border-white/15 bg-white/5' : 'border-white/5 bg-white/[0.02] grayscale'
            }`}
          >
            <span className={`block text-lg ${unlocked ? '' : 'opacity-40'}`}>{achievement.icon}</span>
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
