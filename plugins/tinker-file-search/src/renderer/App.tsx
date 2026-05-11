import { observer } from 'mobx-react-lite'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import Toolbar from './components/Toolbar'
import ResultView from './components/ResultView'
import FilePreview from './components/FilePreview'
import store from './store'

export default observer(function App() {
  return (
    <ToasterProvider>
      <div
        className={`h-screen flex flex-col transition-colors ${tw.bg.primary}`}
      >
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <ResultView />
          {store.showPreview && <FilePreview />}
        </div>
      </div>
    </ToasterProvider>
  )
})
