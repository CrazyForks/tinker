import { observer } from 'mobx-react-lite'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import store from './store'
import FolderOpen from './components/FolderOpen'
import ScanningView from './components/ScanningView'
import ChartView from './components/ChartView'
import Toolbar from './components/Toolbar'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <ToasterProvider>
      <div
        className={`h-screen flex flex-col transition-colors ${tw.bg.primary}`}
      >
        <Toolbar />

        {store.view === 'open' && <FolderOpen />}
        {store.view === 'scanning' && <ScanningView />}
        {store.view === 'chart' && <ChartView />}
      </div>
    </ToasterProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
