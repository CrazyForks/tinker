import { useEffect, useState } from 'react'
import fileSize from 'licia/fileSize'
import fileUrl from 'licia/fileUrl'
import dateFormat from 'licia/dateFormat'
import { tw } from '../theme'
import { getFileCategory, getFileIcon } from '../lib/util'

interface FileStat {
  size: number
  mtime: string
  atime: string
  ctime: string
}

export interface FilePreviewProps {
  path: string | null
  locale?: string
}

const BUILT_IN_TRANSLATIONS = {
  'en-US': {
    noFileSelected: 'Select a file to preview',
    name: 'Name:',
    path: 'Path:',
    size: 'Size:',
    modified: 'Modified:',
    created: 'Created:',
    lastOpened: 'Last Opened:',
  },
  'zh-CN': {
    noFileSelected: '选择文件以预览',
    name: '名称：',
    path: '路径：',
    size: '大小：',
    modified: '修改时间：',
    created: '创建时间：',
    lastOpened: '上次打开：',
  },
}

const iconCache = new Map<string, string>()
const fstatCache = new Map<string, FileStat>()

export default function FilePreview({
  path,
  locale = 'en-US',
}: FilePreviewProps) {
  const t = BUILT_IN_TRANSLATIONS[locale] || BUILT_IN_TRANSLATIONS['en-US']
  const [icon, setIcon] = useState<string | undefined>(undefined)
  const [fstat, setFstat] = useState<FileStat | undefined>(undefined)

  useEffect(() => {
    if (!path) return

    if (iconCache.has(path)) {
      setIcon(iconCache.get(path))
    } else {
      setIcon(undefined)
      getFileIcon(path).then((result) => {
        if (result) {
          iconCache.set(path, result)
          setIcon(result)
        }
      })
    }

    if (fstatCache.has(path)) {
      setFstat(fstatCache.get(path))
    } else {
      setFstat(undefined)
      tinker.fstat(path).then((stat) => {
        const s = {
          size: stat.size,
          mtime: stat.mtime,
          atime: stat.atime,
          ctime: stat.ctime,
        }
        fstatCache.set(path, s)
        setFstat(s)
      })
    }
  }, [path])

  if (!path) {
    return (
      <div
        className={`w-[280px] border-l ${tw.border} flex items-center justify-center`}
      >
        <span className={`text-xs ${tw.text.tertiary}`}>
          {t.noFileSelected}
        </span>
      </div>
    )
  }

  const name = path.split(/[\\/]/).pop() || path
  const dir = path.replace(/[\\/][^\\/]+$/, '')
  const isImage = getFileCategory(path) === 'image'

  return (
    <div
      className={`w-[280px] border-l ${tw.border} flex flex-col overflow-hidden`}
    >
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        {isImage ? (
          <img
            src={fileUrl(path)}
            alt={name}
            className="max-w-full max-h-full object-contain"
          />
        ) : icon ? (
          <img src={icon} alt="" className="w-16 h-16" />
        ) : (
          <div className="w-16 h-16" />
        )}
      </div>
      <div className={`p-4 space-y-2`}>
        <InfoRow label={t.name} value={name} />
        <InfoRow label={t.path} value={dir} />
        {fstat && (
          <>
            <InfoRow label={t.size} value={fileSize(fstat.size)} />
            <InfoRow
              label={t.modified}
              value={dateFormat(new Date(fstat.mtime), 'yyyy-mm-dd HH:MM')}
            />
            <InfoRow
              label={t.created}
              value={dateFormat(new Date(fstat.ctime), 'yyyy-mm-dd HH:MM')}
            />
            <InfoRow
              label={t.lastOpened}
              value={dateFormat(new Date(fstat.atime), 'yyyy-mm-dd HH:MM')}
            />
          </>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-xs leading-5">
      <span className={`${tw.text.secondary} mr-1`}>{label}</span>
      <span className={`${tw.text.primary} break-all`}>{value}</span>
    </div>
  )
}
