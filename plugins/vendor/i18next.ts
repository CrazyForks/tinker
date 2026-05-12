import i18next from 'i18next'
import * as reactI18next from 'react-i18next'

const g = globalThis as Record<string, unknown>

g.i18next = i18next
g.reactI18next = reactI18next

export { i18next, reactI18next }
