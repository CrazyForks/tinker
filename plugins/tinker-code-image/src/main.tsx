import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { getHighlighterCore } from 'shiki'
import getWasm from 'shiki/wasm'
import { tw } from 'share/theme'
import store, { LANGUAGES, shikiTheme } from './store'
import Frame from './components/Frame'
import Toolbar from './components/Toolbar'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  useEffect(() => {
    // Initialize Shiki highlighter
    getHighlighterCore({
      themes: [shikiTheme],
      langs: [
        LANGUAGES.javascript.src(),
        LANGUAGES.typescript.src(),
        LANGUAGES.python.src(),
      ],
      loadWasm: getWasm,
    }).then((highlighter) => {
      store.setHighlighter(highlighter as any)
    })
  }, [])

  if (!store.highlighter) {
    return (
      <div
        className={`h-screen flex items-center justify-center ${tw.bg.primary}`}
      >
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${tw.bg.primary}`}>
      <Toolbar />
      <div className="flex-1 min-h-0">
        <Frame />
      </div>
    </div>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
