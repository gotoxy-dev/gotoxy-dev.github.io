import type { ComponentType } from 'react'
import type { CaseShowcase } from '@/content/site'
import { CamBoard } from './cam/CamBoard'
import { CamOutcomes } from './cam/CamOutcomes'
import { CamStory } from './cam/CamStory'

/**
 * Product visuals drawn in code, by `CaseStudy.showcase.id`:
 * - Board: the presentation image (home card, chapter 1 cover). Covers its box.
 * - Story: the animated explainer (chapter 2). Restarts whenever `active` turns true, pauses when false.
 * - Outcomes: before / after of the daily operation (chapter 3). Plays its entrance when `active`.
 */
export interface ShowcaseVisuals {
  Board: ComponentType<{ label: string; className?: string; zoomOnHover?: boolean; intro?: boolean; cover?: boolean }>
  Story: ComponentType<{ story: CaseShowcase['story']; active: boolean; className?: string }>
  Outcomes: ComponentType<{ outcomes: CaseShowcase['outcomes']; active: boolean; className?: string }>
}

export const showcases: Record<CaseShowcase['id'], ShowcaseVisuals> = {
  cam: { Board: CamBoard, Story: CamStory, Outcomes: CamOutcomes },
}
