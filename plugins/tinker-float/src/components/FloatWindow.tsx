import { tw } from 'share/theme'
import Webview from 'share/components/Webview'

interface FloatWindowProps {
  contentType: 'image' | 'text' | 'video' | 'url'
  imageDataUrl: string
  textContent: string
  videoSrc: string
  onClose: () => void
  webviewSrc?: string
  onWebviewError?: () => void
  onWebviewReady?: () => void
}

export default function FloatWindow({
  contentType,
  imageDataUrl,
  textContent,
  videoSrc,
  onClose,
  webviewSrc,
  onWebviewError,
  onWebviewReady,
}: FloatWindowProps) {
  return (
    <div
      className={`h-screen overflow-hidden flex flex-col ${
        contentType === 'video'
          ? 'bg-black'
          : contentType === 'image'
          ? 'bg-transparent'
          : tw.bg.primary
      } relative`}
    >
      {contentType === 'url' && (
        <div className="absolute top-0 left-0 right-0 h-8 z-10 flex items-center">
          <div
            className="flex-1 h-full"
            style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
          />
          <button
            className="h-4 w-4 mr-1 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-black/30 hover:bg-black/50 text-[10px] leading-none cursor-pointer transition-colors duration-200"
            onClick={onClose}
          >
            &#x2715;
          </button>
        </div>
      )}
      {contentType === 'video' && (
        <div
          className="absolute top-0 left-0 right-0 h-5 z-10"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        />
      )}
      {contentType === 'image' && (
        <img
          src={imageDataUrl}
          className="w-full h-full object-cover"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        />
      )}
      {contentType === 'video' && (
        <video
          src={videoSrc}
          className="block w-full flex-1 min-h-0"
          autoPlay
          controls
        />
      )}
      {contentType === 'url' && webviewSrc && (
        <Webview
          src={webviewSrc}
          className="w-full flex-1 min-h-0"
          onLoadError={() => {
            onWebviewError?.()
          }}
          onDomReady={() => {
            onWebviewReady?.()
          }}
        />
      )}
      {contentType === 'text' && (
        <pre
          className={`whitespace-pre-wrap break-words text-sm font-sans p-4 ${tw.text.primary}`}
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        >
          {textContent}
        </pre>
      )}
    </div>
  )
}
