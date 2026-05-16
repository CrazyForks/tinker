import { observer } from 'mobx-react-lite'
import { AlertProvider } from 'share/components/Alert'
import { ConfirmProvider } from 'share/components/Confirm'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import renderApp from 'share/lib/renderApp'
import SessionList from './components/SessionList'
import SessionToolbar from './components/SessionToolbar'
import MessageList from './components/MessageList'
import InputArea from './components/InputArea'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <AlertProvider>
      <ConfirmProvider>
        <ToasterProvider>
          <div className={`h-screen flex flex-col ${tw.bg.primary}`}>
            <div className={`border-t ${tw.border}`} />
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div
                className={`w-48 shrink-0 flex flex-col overflow-hidden ${tw.bg.tertiary}`}
              >
                <SessionList />
              </div>

              {/* Main */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <SessionToolbar />
                <MessageList />
                <InputArea />
              </div>
            </div>
          </div>
        </ToasterProvider>
      </ConfirmProvider>
    </AlertProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
