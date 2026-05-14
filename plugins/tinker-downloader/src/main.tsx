import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ConfirmProvider } from 'share/components/Confirm'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import Toolbar from './components/Toolbar'
import DownloadList from './components/DownloadList'
import AddDownloadModal from './components/AddDownloadModal'
import store from './store'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  const { i18n } = useTranslation()

  return (
    <ConfirmProvider locale={i18n.language}>
      <ToasterProvider>
        <div className={`h-screen flex flex-col ${tw.bg.primary}`}>
          <Toolbar />
          <DownloadList />
          <AddDownloadModal
            visible={store.addModalVisible}
            onClose={() => store.setAddModalVisible(false)}
          />
        </div>
      </ToasterProvider>
    </ConfirmProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
