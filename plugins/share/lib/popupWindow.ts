import { createRoot } from 'react-dom/client'
import type { ReactNode } from 'react'

export interface PopupWindowOptions {
  width: number
  height: number
  minWidth?: number
  minHeight?: number
  alwaysOnTop?: boolean
  webviewTag?: boolean
}

export function openPopupWindow(
  options: PopupWindowOptions,
  render: (popup: Window, onClose: () => void) => ReactNode
): Window | null {
  const {
    width,
    height,
    minWidth,
    minHeight,
    alwaysOnTop = true,
    webviewTag,
  } = options

  const features = [
    `width=${width}`,
    `height=${height}`,
    minWidth != null ? `minWidth=${minWidth}` : '',
    minHeight != null ? `minHeight=${minHeight}` : '',
    `alwaysOnTop=${alwaysOnTop}`,
    'frame=no',
    webviewTag ? 'webviewTag=true' : '',
  ]
    .filter(Boolean)
    .join(',')

  const popup = window.open('', '_blank', features)
  if (!popup) return null

  const styles = document.querySelectorAll('style, link[rel="stylesheet"]')
  styles.forEach((node) => {
    popup.document.head.appendChild(node.cloneNode(true))
  })

  const container = popup.document.createElement('div')
  container.id = 'popup-root'
  popup.document.body.style.margin = '0'
  popup.document.documentElement.className = document.documentElement.className
  popup.document.body.appendChild(container)

  const root = createRoot(container)
  root.render(render(popup, () => popup.close()))

  popup.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') popup.close()
  })

  popup.addEventListener('beforeunload', () => {
    root.unmount()
  })

  return popup
}
