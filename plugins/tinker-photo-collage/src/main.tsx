import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { AlertProvider } from 'share/components/Alert'
import { tw } from 'share/theme'
import store from './store'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import CollageCanvas from './components/CollageCanvas'
import { getTemplateById } from './lib/templates'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  useEffect(() => {
    const template = getTemplateById(store.selectedTemplateId)
    if (template) {
      store.setTemplate(template.id, template.areas)
    }
  }, [])

  return (
    <AlertProvider>
      <div className={`h-screen flex flex-col ${tw.bg.primary}`}>
        <Toolbar />

        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <CollageCanvas />
        </div>
      </div>
    </AlertProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
