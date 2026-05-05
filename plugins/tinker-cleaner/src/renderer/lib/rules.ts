import type { Category } from '../types'

export const categories: { id: Category | 'all'; nameKey: string }[] = [
  { id: 'all', nameKey: 'category.all' },
  { id: 'system', nameKey: 'category.system' },
  { id: 'userCache', nameKey: 'category.userCache' },
  { id: 'browser', nameKey: 'category.browser' },
  { id: 'devTools', nameKey: 'category.devTools' },
  { id: 'app', nameKey: 'category.app' },
]
