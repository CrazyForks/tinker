import { observer } from 'mobx-react-lite'
import { useRef, useEffect, useCallback } from 'react'
import { autorun } from 'mobx'
import { X } from 'lucide-react'
import { tw } from 'share/theme'
import store from '../store'
import NewTabPage from './NewTabPage'
import i18n from '../i18n'

interface ContextMenuEvent extends Event {
  params: { x: number; y: number }
}

interface DevToolsPanelProps {
  onReady: (wv: Electron.WebviewTag) => void
}

function createWebview(tabId: string, url: string): Electron.WebviewTag {
  const wv = document.createElement('webview') as Electron.WebviewTag
  wv.src = url
  wv.style.width = '100%'
  wv.style.height = '100%'
  wv.style.position = 'absolute'
  wv.style.top = '0'
  wv.style.left = '0'
  wv.setAttribute('allowpopups', '')

  wv.addEventListener('did-start-loading', () => {
    store.updateTabLoading(tabId, true)
  })

  wv.addEventListener('did-stop-loading', () => {
    store.updateTabLoading(tabId, false)
    store.updateTabNavState(tabId, wv.canGoBack(), wv.canGoForward())
  })

  wv.addEventListener('page-title-updated', (e) => {
    store.updateTabTitle(tabId, e.title)
  })

  wv.addEventListener('page-favicon-updated', (e) => {
    if (e.favicons && e.favicons.length > 0) {
      store.updateTabFavicon(tabId, e.favicons[0])
    }
  })

  wv.addEventListener('did-navigate', (e) => {
    store.updateTabUrl(tabId, e.url)
    store.updateTabNavState(tabId, wv.canGoBack(), wv.canGoForward())
  })

  wv.addEventListener('did-navigate-in-page', (e) => {
    if (e.isMainFrame) {
      store.updateTabUrl(tabId, e.url)
      store.updateTabNavState(tabId, wv.canGoBack(), wv.canGoForward())
    }
  })

  wv.addEventListener('new-window', (e) => {
    store.addTab((e as Event & { url: string }).url)
  })

  wv.addEventListener('context-menu', (e) => {
    const { params } = e as unknown as ContextMenuEvent
    tinker.showContextMenu(params.x, params.y, [
      {
        label: i18n.t('back'),
        click: () => store.goBack(),
        enabled: wv.canGoBack(),
      },
      {
        label: i18n.t('forward'),
        click: () => store.goForward(),
        enabled: wv.canGoForward(),
      },
      {
        label: i18n.t('reload'),
        click: () => store.reload(),
      },
      { type: 'separator' },
      {
        label: i18n.t('inspect'),
        click: () => store.inspectElement(params.x, params.y),
      },
    ])
  })

  return wv
}

function DevToolsPanel({ onReady }: DevToolsPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const wv = document.createElement('webview') as Electron.WebviewTag
    let connected = false
    wv.src = 'about:blank'
    wv.style.width = '100%'
    wv.style.height = '100%'
    container.appendChild(wv)

    wv.addEventListener('dom-ready', () => {
      if (connected) return
      connected = true
      onReady(wv)
    })

    return () => {
      store.devToolsWebviewRef = null
      container.removeChild(wv)
    }
  }, [onReady])

  return (
    <div className={`h-[40%] flex flex-col ${tw.border} border-t`}>
      <div
        className={`flex items-center justify-end px-2 py-1 ${tw.bg.secondary}`}
      >
        <button
          className={`p-0.5 rounded ${tw.text.secondary} ${tw.hover}`}
          onClick={() => store.closeDevTools()}
        >
          <X size={14} />
        </button>
      </div>
      <div ref={containerRef} className="flex-1 overflow-hidden" />
    </div>
  )
}

export default observer(function WebviewContainer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const webviewElements = new Map<string, Electron.WebviewTag>()

    const dispose = autorun(() => {
      const currentTabIds = new Set(store.tabs.map((t) => t.id))

      for (const [tabId, wv] of webviewElements) {
        if (!currentTabIds.has(tabId)) {
          container.removeChild(wv)
          webviewElements.delete(tabId)
          store.webviewRefs.delete(tabId)
        }
      }

      for (const tab of store.tabs) {
        if (!webviewElements.has(tab.id) && tab.url) {
          const wv = createWebview(tab.id, tab.url)
          container.appendChild(wv)
          webviewElements.set(tab.id, wv)
          store.webviewRefs.set(tab.id, wv)
        }

        const wv = webviewElements.get(tab.id)
        if (wv) {
          wv.style.display = tab.id === store.activeTabId ? 'flex' : 'none'
        }
      }
    })

    return () => {
      dispose()
      for (const [, wv] of webviewElements) {
        container.removeChild(wv)
      }
      webviewElements.clear()
    }
  }, [])

  const handleDevToolsReady = useCallback((wv: Electron.WebviewTag) => {
    store.devToolsWebviewRef = wv
    store.connectDevTools()
  }, [])

  const showNewTab = store.activeTab && !store.activeTab.url

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        {showNewTab && <NewTabPage />}
      </div>
      {store.devToolsOpen && <DevToolsPanel onReady={handleDevToolsReady} />}
    </div>
  )
})
