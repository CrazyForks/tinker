import { observer } from 'mobx-react-lite'
import { AlertProvider } from 'share/components/Alert'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import DualPanel from './components/DualPanel'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <ToasterProvider>
      <AlertProvider>
        <div
          className={`h-screen flex flex-col transition-colors ${tw.bg.primary}`}
        >
          <div className="flex-1 overflow-hidden">
            <DualPanel />
          </div>
        </div>
      </AlertProvider>
    </ToasterProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
