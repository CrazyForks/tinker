import type { Category } from '../common/types'

export type { Category }

export interface CleanRule {
  id: string
  category: Category
  nameKey: string
  path: string
  size: number
  scanned: boolean
}
