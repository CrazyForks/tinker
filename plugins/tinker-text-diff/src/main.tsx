import { observer } from 'mobx-react-lite'
import { tw } from 'share/theme'
import DiffEditor from './components/DiffEditor'
import DualEditor from './components/DualEditor'
import Toolbar from './components/Toolbar'
import store from './store'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <div className={`h-screen flex flex-col ${tw.bg.primary}`}>
      <Toolbar />

      <div className={`flex-1 overflow-hidden ${tw.bg.primary}`}>
        {store.mode === 'edit' ? <DualEditor /> : <DiffEditor />}
      </div>
    </div>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
