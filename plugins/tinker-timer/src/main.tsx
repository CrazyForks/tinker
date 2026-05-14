import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { tw } from 'share/theme'
import store from './store'
import Stopwatch from './components/Stopwatch'
import Countdown from './components/Countdown'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const TABS = ['stopwatch', 'countdown'] as const

const App = observer(function App() {
  const { t } = useTranslation()

  return (
    <div className={`h-screen flex flex-col ${tw.bg.secondary}`}>
      <div className="flex items-center justify-center pt-4 pb-2 shrink-0">
        <div className={`flex rounded-full p-1 gap-0.5 ${tw.active}`}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => store.setTab(tab)}
              className={`w-24 py-1 rounded-full text-sm font-medium transition-colors ${
                store.tab === tab
                  ? `bg-white dark:bg-gray-500 ${tw.text.primary} shadow-sm`
                  : `${tw.text.secondary}`
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {store.tab === 'stopwatch' ? <Stopwatch /> : <Countdown />}
      </div>
    </div>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
