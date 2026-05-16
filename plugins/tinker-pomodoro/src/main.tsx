import { observer } from 'mobx-react-lite'
import { AlertProvider } from 'share/components/Alert'
import { tw } from 'share/theme'
import TimerDisplay from './components/TimerDisplay'
import ControlButton from './components/ControlButton'
import Footer from './components/Footer'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <AlertProvider>
      <div
        className={`h-screen flex flex-col ${tw.bg.secondary} transition-colors overflow-hidden`}
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <TimerDisplay />
          <ControlButton />
        </div>
        <Footer />
      </div>
    </AlertProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
