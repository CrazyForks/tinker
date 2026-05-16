import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { AlertProvider } from 'share/components/Alert'
import { ConfirmProvider } from 'share/components/Confirm'
import { PromptProvider } from 'share/components/Prompt'
import { tw } from 'share/theme'
import store from './store'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  useEffect(() => {
    store.loadSystemHosts()
  }, [])

  return (
    <AlertProvider>
      <ConfirmProvider>
        <PromptProvider>
          <div
            className={`h-screen flex flex-col overflow-hidden ${tw.bg.primary}`}
          >
            <div className={`border-t ${tw.border}`} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <Editor />
            </div>
          </div>
        </PromptProvider>
      </ConfirmProvider>
    </AlertProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
