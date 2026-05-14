import { observer } from 'mobx-react-lite'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import Toolbar from './components/Toolbar'
import PdfViewer from './components/PdfViewer'
import Sidebar from './components/Sidebar'
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
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <PdfViewer />
        </div>
      </div>
    </ToasterProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
