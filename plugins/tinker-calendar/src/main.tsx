import { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import FullCalendar from '@fullcalendar/react'
import { ConfirmProvider } from 'share/components/Confirm'
import { PromptProvider } from 'share/components/Prompt'
import { tw } from 'share/theme'
import CalendarView from './components/CalendarView'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import store from './store'
import renderApp from 'share/lib/renderApp'
import './index.scss'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'

const App = observer(function App() {
  const calendarRef = useRef<FullCalendar | null>(null)
  const [currentView, setCurrentView] = useState<string>('dayGridMonth')

  return (
    <ConfirmProvider>
      <PromptProvider>
        <div
          className={`h-screen flex flex-col transition-colors ${tw.bg.primary} ${tw.text.primary}`}
        >
          <Toolbar
            calendarRef={calendarRef}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1">
              <CalendarView
                calendarRef={calendarRef}
                setCurrentView={setCurrentView}
              />
            </div>
            {store.sidebarOpen && (
              <div>
                <Sidebar />
              </div>
            )}
          </div>
        </div>
      </PromptProvider>
    </ConfirmProvider>
  )
})

renderApp(App, { 'en-US': enUS, 'zh-CN': zhCN })
