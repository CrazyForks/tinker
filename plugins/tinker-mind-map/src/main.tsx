import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { AlertProvider } from 'share/components/Alert'
import { tw } from 'share/theme'
import Toolbar from './components/Toolbar'
import MindMapCanvas from './components/MindMapCanvas'
import ZoomControls from './components/ZoomControls'
import Sidebar from './components/Sidebar'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  const { i18n } = useTranslation()

  return (
    <AlertProvider locale={i18n.language}>
      <div className={`h-screen flex flex-col ${tw.bg.primary}`}>
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-hidden relative">
            <MindMapCanvas />
            <ZoomControls />
          </div>
        </div>
      </div>
    </AlertProvider>
  )
})


renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
