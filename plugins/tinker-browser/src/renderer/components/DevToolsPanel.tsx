import { useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { X, PanelBottom, PanelLeft, PanelRight, LucideIcon } from 'lucide-react'
import { tw } from 'share/theme'
import store from '../store'

interface DevToolsPanelProps {
  onReady: (wv: Electron.WebviewTag) => void
}

const dockButtons: {
  pos: 'bottom' | 'left' | 'right'
  Icon: LucideIcon
  title: string
}[] = [
  { pos: 'bottom', Icon: PanelBottom, title: 'Dock to bottom' },
  { pos: 'left', Icon: PanelLeft, title: 'Dock to left' },
  { pos: 'right', Icon: PanelRight, title: 'Dock to right' },
]

export default observer(function DevToolsPanel({
  onReady,
}: DevToolsPanelProps) {
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
      <div ref={containerRef} className="flex-1 overflow-hidden" />
    </div>
  )
})
