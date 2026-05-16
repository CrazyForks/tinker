import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import store from './store'
import Toolbar from './components/Toolbar'
import ClipboardList from './components/ClipboardList'
import { ConfirmProvider } from 'share/components/Confirm'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  useEffect(() => {
    clipboard.startMonitoring((item) => {
      store.addItem(item)
    })

    return () => {
      clipboard.stopMonitoring()
    }
  }, [])

  return (
    <ConfirmProvider>
      <ToasterProvider>
        <div className={`h-screen flex flex-col ${tw.bg.primary}`}>
          <Toolbar />
          <ClipboardList />
        </div>
      </ToasterProvider>
    </ConfirmProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
