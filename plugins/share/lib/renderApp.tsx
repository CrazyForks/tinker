import { createRoot } from 'react-dom/client'
import { initI18n } from './i18n'

interface Locales {
  'en-US': object
  'zh-CN': object
}

export default async function renderApp(
  App: React.ComponentType,
  locales: Locales
) {
  await initI18n(locales)

  const container = document.getElementById('app') as HTMLElement
  createRoot(container).render(<App />)
}
