import toast from 'react-hot-toast'
import { openPopupWindow } from 'share/lib/popupWindow'
import FloatWindow from '../components/FloatWindow'
import store from '../store'

export function launchFloatWindow() {
  const width = store.windowWidth
  const height =
    store.contentType === 'image' ? store.effectiveHeight : store.windowHeight

  let webviewTimeout: ReturnType<typeof setTimeout> | null = null

  const popup = openPopupWindow(
    {
      width,
      height,
      minWidth: store.minWindowWidth,
      minHeight: store.minWindowHeight,
      alwaysOnTop: store.alwaysOnTop,
      webviewTag: store.contentType === 'url',
    },
    (_popup, onClose) => (
      <FloatWindow
        contentType={store.contentType}
        imageDataUrl={store.imageDataUrl}
        textContent={store.textContent}
        videoSrc={store.videoSrc}
        onClose={onClose}
      />
    )
  )
  if (!popup) return

  if (store.contentType === 'url') {
    const urlSrc = store.urlSrc
    // Wait for React render to complete before inserting webview
    setTimeout(() => {
      const webview = popup.document.createElement('webview') as HTMLElement
      webview.setAttribute('src', urlSrc)
      webview.style.width = '100%'
      webview.style.height = '100%'
      const webviewContainer =
        popup.document.getElementById('webview-container')
      if (webviewContainer) {
        webviewContainer.appendChild(webview)

        const handleError = () => {
          popup.close()
          toast.error(`Unable to load ${urlSrc}`)
        }

        webview.addEventListener('did-fail-load', ((e: Event) => {
          const detail = e as Event & { errorCode: number }
          // errorCode -3 is aborted, ignore
          if (detail.errorCode === -3) return
          handleError()
        }) as EventListener)

        // Fallback: if webview doesn't fire dom-ready within 15s
        webviewTimeout = setTimeout(() => {
          if (!webview.isConnected) return
          handleError()
        }, 15000)

        webview.addEventListener('dom-ready', () => {
          if (webviewTimeout) clearTimeout(webviewTimeout)
        })
      }
    }, 0)
  }

  popup.addEventListener('beforeunload', () => {
    if (webviewTimeout) clearTimeout(webviewTimeout)
  })

  store.clearContent()
}
