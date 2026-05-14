import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { AlertProvider } from 'share/components/Alert'
import { ConfirmProvider } from 'share/components/Confirm'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import ProcessList from './components/ProcessList'
import Toolbar from './components/Toolbar'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  const { i18n } = useTranslation()

  return (
    <ToasterProvider>
      <AlertProvider locale={i18n.language}>
        <ConfirmProvider locale={i18n.language}>
          <div
            className={`h-screen flex flex-col transition-colors ${tw.bg.primary}`}
          >
            <Toolbar />
            <div className="flex-1 overflow-hidden">
              <ProcessList />
            </div>
          </div>
        </ConfirmProvider>
      </AlertProvider>
    </ToasterProvider>
  )
})


renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
