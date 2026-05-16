import { observer } from 'mobx-react-lite'
import { Plus } from 'lucide-react'
import { tw } from 'share/theme'
import store from '../store'
import Tab from './Tab'

export default observer(function TabBar() {
  return (
    <div
      className={`relative flex items-center ${tw.bg.secondary} h-[38px] min-h-[38px]`}
    >
      <div className="flex items-end overflow-x-hidden min-w-0 h-full pt-[4px] relative">
        {store.tabs.map((tab, i) => {
          return <Tab key={tab.id} tab={tab} isFirst={i === 0} />
        })}
        {/* Separators rendered at TabBar level to avoid z-index stacking issues */}
        {store.tabs.map((tab, i) => {
          const nextTab = store.tabs[i + 1]
          const isActive = tab.id === store.activeTabId
          const nextIsActive = nextTab?.id === store.activeTabId
          const isLast = i === store.tabs.length - 1
          const showSep = !isLast && !isActive && !nextIsActive

          if (!showSep) return null

          const left = `${((i + 1) / store.tabs.length) * 100}%`

          return (
            <div
              key={`sep-${tab.id}`}
              className={`absolute top-1/4 bottom-1/4 w-px z-[10] ${tw.bg.border}`}
              style={{ left }}
            />
          )
        })}
      </div>
      <button
        className={`p-1 mx-1.5 rounded-md flex-shrink-0 ${tw.hover} transition-colors`}
        onClick={() => store.addTab()}
      >
        <Plus size={14} className={tw.text.secondary} />
      </button>
      <div
        className={`absolute bottom-0 left-0 right-0 h-px ${tw.bg.border}`}
      />
    </div>
  )
})
