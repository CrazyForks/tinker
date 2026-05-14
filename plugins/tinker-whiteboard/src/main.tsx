import { observer } from 'mobx-react-lite'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import ThemeSync from './components/ThemeSync'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <div className="h-screen w-screen">
      <Tldraw persistenceKey="tinker-whiteboard">
        <ThemeSync />
      </Tldraw>
    </div>
  )
})


renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
