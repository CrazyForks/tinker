import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ToasterProvider } from 'share/components/Toaster'
import FilePreview from 'share/components/FilePreview'
import { tw } from 'share/theme'
import Toolbar from './components/Toolbar'
import ResultView from './components/ResultView'
import store from './store'

export default observer(function App() {
  const { i18n } = useTranslation()
  const file = store.selectedFile

  return (
    <ToasterProvider>
      <div
        className={`h-screen flex flex-col transition-colors ${tw.bg.primary}`}
      >
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <ResultView />
          {store.showPreview && (
            <FilePreview path={file?.path ?? null} locale={i18n.language} />
          )}
        </div>
      </div>
    </ToasterProvider>
  )
})
