import type { ComponentType } from 'react'
import type { EnrichedCreator } from '../lib/scoring'
import type { Meta } from '../types'
import IssueCard from './IssueCard'
import VoiceMeter from './VoiceMeter'
import LightWall from './LightWall'
import FeatureCard from './FeatureCard'
import Achievements from './Achievements'
import { CORRECTION_URL, ADD_POST_URL } from '../config'
import {
  SproutIcon,
  SpeechIcon,
  MegaphoneIcon,
  FlameIcon,
  NewspaperIcon,
  BarsIcon,
  ScaleIcon,
  PenIcon,
  MedalIcon,
  type IconProps,
} from './icons'

const LEVEL_CHIPS: { name: string; Icon: ComponentType<IconProps> }[] = [
  { name: 'First words', Icon: SproutIcon },
  { name: 'Steady voice', Icon: SpeechIcon },
  { name: 'Amplifier', Icon: MegaphoneIcon },
  { name: 'Torchbearer', Icon: FlameIcon },
]

interface SidebarProps {
  meta: Meta
  allCreators: EnrichedCreator[]
  tierSpoke: number
  tierTracked: number
  tierLabel: string
  selectedTierId: string
}

export default function Sidebar({ meta, allCreators, tierSpoke, tierTracked, tierLabel, selectedTierId }: SidebarProps) {
  const globalSpoke = allCreators.filter((c) => c.status === 'spoke').length

  return (
    <aside className="flex flex-col gap-4">
      <IssueCard issue={meta.issue} updatedAt={meta.updatedAt} spoke={globalSpoke} total={allCreators.length} />

      <div className="glass-panel rounded-[22px] p-4">
        <VoiceMeter spoke={tierSpoke} tracked={tierTracked} tierLabel={tierLabel} />
        <div className="mt-4 border-t border-white/10 pt-4">
          <LightWall creators={allCreators} selectedTierId={selectedTierId} />
        </div>
      </div>

      <FeatureCard
        icon={<NewspaperIcon className="h-5 w-5" />}
        title="Track public posts"
        description="Instagram and reported public appearances both count — not just Instagram Stories."
      />

      <FeatureCard
        icon={<BarsIcon className="h-5 w-5" />}
        title="Score by depth"
        description="A passing mention counts less than standing on stage. Deeper engagement earns more."
      >
        <div className="flex flex-wrap gap-1.5">
          {LEVEL_CHIPS.map((lvl) => (
            <span
              key={lvl.name}
              className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-1 text-[11px] text-white/75"
            >
              <lvl.Icon className="h-3 w-3" />
              {lvl.name}
            </span>
          ))}
        </div>
      </FeatureCard>

      <FeatureCard
        icon={<FlameIcon className="h-5 w-5" />}
        title="Keep a streak"
        description="Consecutive weeks of speaking up build a streak — and a badge once it hits three."
      />

      <FeatureCard
        icon={<MedalIcon className="h-5 w-5" />}
        title="Unlock achievements"
        description="Badges for depth, consistency, reach and more — unlocked across all tracked creators."
      >
        <Achievements creators={allCreators} />
      </FeatureCard>

      <FeatureCard
        icon={<ScaleIcon className="h-5 w-5" />}
        title="Substance, not stance"
        description="Nobody is scored by which side they take — only by whether they used their reach at all."
      >
        <a
          href={CORRECTION_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-accent-from underline-offset-2 hover:underline"
        >
          Request a correction →
        </a>
      </FeatureCard>

      <FeatureCard icon={<PenIcon className="h-5 w-5" />} title="Submit a post" description="Seen a public post we missed? Help keep the board accurate.">
        <a
          href={ADD_POST_URL}
          target="_blank"
          rel="noreferrer"
          className="accent-gradient inline-block w-full rounded-lg py-2 text-center text-sm font-semibold text-black/90"
        >
          Submit a post
        </a>
      </FeatureCard>
    </aside>
  )
}
