import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { ToasterProvider } from 'share/components/Toaster'
import { tw } from 'share/theme'
import store from './store'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import RuleList from './components/RuleList'
import ScanningView from './components/ScanningView'

export default observer(function App() {
  useEffect(() => {
    store.init()
  }, [])

  return (
    <ToasterProvider>
      <div
        className={`h-screen flex flex-col transition-colors ${tw.bg.primary}`}
      >
        {store.view === 'scanning' ? (
          <ScanningView />
        ) : (
          <>
            <Toolbar />
            <div className="flex-1 flex overflow-hidden">
              <Sidebar />
              <RuleList />
            </div>
          </>
        )}
      </div>
    </ToasterProvider>
  )
})
