import { observer } from 'mobx-react-lite'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import store from './store'
import Toolbar from './components/Toolbar'
import ResultView from './components/ResultView'

export default observer(function App() {
  return (
    <ToasterProvider>
      <div
        className={`h-screen flex flex-col transition-colors ${tw.bg.primary}`}
      >
        <Toolbar />
        <ResultView />
      </div>
    </ToasterProvider>
  )
})
