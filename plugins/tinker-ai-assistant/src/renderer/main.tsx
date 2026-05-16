import { observer } from 'mobx-react-lite'
import { AlertProvider } from 'share/components/Alert'
import { ConfirmProvider } from 'share/components/Confirm'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import renderApp from 'share/lib/renderApp'
import Toolbar from './components/Toolbar'
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
            <Toolbar />
            <MessageList />
            <InputArea />
          </div>
        </ToasterProvider>
      </ConfirmProvider>
    </AlertProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
