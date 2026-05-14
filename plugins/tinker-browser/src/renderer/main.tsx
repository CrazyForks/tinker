import { observer } from 'mobx-react-lite'
import { tw } from 'share/theme'
import TabBar from './components/TabBar'
import Toolbar from './components/Toolbar'
import WebviewContainer from './components/WebviewContainer'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  return (
    <div className={`h-screen flex flex-col ${tw.bg.primary}`}>
      <TabBar />
      <Toolbar />
      <WebviewContainer />
    </div>
  )
})


renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
