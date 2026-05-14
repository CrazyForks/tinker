import { createRoot } from 'react-dom/client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

interface Locales {
  'en-US': object
  'zh-CN': object
}

export default async function renderApp(App: React.ComponentType, locales: Locales) {
  i18n.use(initReactI18next).init({
    resources: {
      'en-US': { translation: locales['en-US'] },
      'zh-CN': { translation: locales['zh-CN'] },
    },
    lng: 'en-US',
    fallbackLng: 'en-US',
    interpolation: { escapeValue: false },
  })

  const language = await tinker.getLanguage()
  i18n.changeLanguage(language)

  const container = document.getElementById('app') as HTMLElement
  createRoot(container).render(<App />)
}
