import { useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { autorun } from 'mobx'
import { X, PanelBottom, PanelLeft, PanelRight, LucideIcon } from 'lucide-react'
import { tw } from 'share/theme'
import store from '../store'

const dockButtons: {
  pos: 'bottom' | 'left' | 'right'
  Icon: LucideIcon
  title: string
}[] = [
  { pos: 'bottom', Icon: PanelBottom, title: 'Dock to bottom' },
  { pos: 'left', Icon: PanelLeft, title: 'Dock to left' },
  { pos: 'right', Icon: PanelRight, title: 'Dock to right' },
]

export default observer(function DevToolsPanel() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const webviewElements = new Map<string, Electron.WebviewTag>()

    const dispose = autorun(() => {
      const currentTabIds = new Set(store.tabs.map((t) => t.id))

      // Remove webviews for closed tabs
      for (const [tabId, wv] of webviewElements) {
        if (!currentTabIds.has(tabId)) {
          container.removeChild(wv)
          webviewElements.delete(tabId)
          store.devToolsWebviewRefs.delete(tabId)
        }
      }

      const activeId = store.activeTabId

      // Create devtools webview for active tab if needed
      if (activeId && !webviewElements.has(activeId)) {
        const wv = document.createElement('webview') as Electron.WebviewTag
        wv.src = 'about:blank'
        wv.style.width = '100%'
        wv.style.height = '100%'
        wv.style.position = 'absolute'
        wv.style.top = '0'
        wv.style.left = '0'
        container.appendChild(wv)
        webviewElements.set(activeId, wv)

        let connected = false
        wv.addEventListener('dom-ready', () => {
          if (connected) return
          connected = true
          store.devToolsWebviewRefs.set(activeId, wv)
          store.connectDevTools()
        })
      }

      // Show active, hide others
      for (const [tabId, wv] of webviewElements) {
        wv.style.display = tabId === activeId ? 'flex' : 'none'
      }
    })

    return () => {
      dispose()
      for (const [tabId, wv] of webviewElements) {
        container.removeChild(wv)
        store.devToolsWebviewRefs.delete(tabId)
      }
      webviewElements.clear()
    }
  }, [])

  const position = store.devToolsPosition

  return (
    <div className="h-full flex flex-col">
      <div
        className={`flex items-center justify-between px-2 py-1 ${tw.bg.secondary} ${tw.border} border-t`}
      >
        <div className="flex items-center gap-1">
          {dockButtons.map(({ pos, Icon, title }) => (
            <button
              key={pos}
              className={`p-0.5 rounded ${
                position === pos ? tw.text.primary : tw.text.secondary
              } ${tw.hover}`}
              onClick={() => store.setDevToolsPosition(pos)}
              title={title}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
        <button
          className={`p-0.5 rounded ${tw.text.secondary} ${tw.hover}`}
          onClick={() => store.closeDevTools()}
        >
          <X size={14} />
        </button>
      </div>
      <div ref={containerRef} className="flex-1 overflow-hidden relative" />
    </div>
  )
})
