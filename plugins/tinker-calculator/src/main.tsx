import { observer } from 'mobx-react-lite'
import { tw } from 'share/theme'
import Display from './components/Display'
import Keypad from './components/Keypad'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <div
      className={`h-screen w-full flex items-center justify-center p-4 ${tw.bg.secondary}`}
    >
      <div className="w-full max-w-[1024px]">
        <Display />
        <Keypad />
      </div>
    </div>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
