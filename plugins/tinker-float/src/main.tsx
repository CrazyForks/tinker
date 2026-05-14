import { observer } from 'mobx-react-lite'
import { tw } from 'share/theme'
import { ToasterProvider } from 'share/components/Toaster'
import Toolbar from './components/Toolbar'
import Preview from './components/Preview'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <ToasterProvider>
      <div className={`h-screen flex flex-col ${tw.bg.primary}`}>
        <Toolbar />
        <Preview />
      </div>
    </ToasterProvider>
  )
})


renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
