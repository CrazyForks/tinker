import { observer } from 'mobx-react-lite'
import { AlertProvider } from 'share/components/Alert'
import store from './store'
import CodeEditor from './components/CodeEditor'
import Toolbar from './components/Toolbar'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <AlertProvider>
      <div className="h-screen flex flex-col">
        <Toolbar />

        <div className="flex-1 overflow-hidden">
          <CodeEditor
            value={store.input}
            onChange={store.setInput}
            language={store.language}
            height="100%"
          />
        </div>
      </div>
    </AlertProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
