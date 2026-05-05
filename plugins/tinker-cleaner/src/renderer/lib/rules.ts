import type { Category } from '../types'

export const categories: { id: Category | 'all'; nameKey: string }[] = [
  { id: 'all', nameKey: 'categoryAll' },
  { id: 'system', nameKey: 'categorySystem' },
  { id: 'userCache', nameKey: 'categoryUserCache' },
  { id: 'browser', nameKey: 'categoryBrowser' },
  { id: 'devTools', nameKey: 'categoryDevTools' },
  { id: 'app', nameKey: 'categoryApp' },
]
