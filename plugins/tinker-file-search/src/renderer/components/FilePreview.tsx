import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import fileSize from 'licia/fileSize'
import dateFormat from 'licia/dateFormat'
import { tw } from 'share/theme'
import store from '../store'

export default observer(function FilePreview() {
  const { t } = useTranslation()
  const file = store.selectedFile

  useEffect(() => {
    if (file && !store.iconCache.has(file.path)) {
      store.loadFileIcon(file.path)
    }
  }, [file?.path])

  if (!file) {
    return (
      <div
        className={`w-[280px] border-l ${tw.border} flex items-center justify-center`}
      >
        <span className={`text-xs ${tw.text.tertiary}`}>
          {t('noFileSelected')}
        </span>
      </div>
    )
  }

  const icon = store.iconCache.get(file.path)
  const name = file.path.split(/[\\/]/).pop() || file.path
  const dir = file.path.replace(/[\\/][^\\/]+$/, '')

  return (
    <div
      className={`w-[280px] border-l ${tw.border} flex flex-col overflow-hidden`}
    >
      <div className="flex-1 flex items-center justify-center p-6">
        {icon ? (
          <img src={icon} alt="" className="w-16 h-16" />
        ) : (
          <div className="w-16 h-16" />
        )}
      </div>
      <div className={`p-4 border-t ${tw.border} space-y-2`}>
        <InfoRow label={t('name')} value={name} />
        <InfoRow label={t('path')} value={dir} />
        <InfoRow label={t('size')} value={fileSize(file.size)} />
        <InfoRow
          label={t('modified')}
          value={dateFormat(new Date(file.dateModified), 'yyyy-mm-dd HH:MM')}
        />
      </div>
    </div>
  )
})

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-xs leading-5">
      <span className={`${tw.text.secondary} mr-1`}>{label}</span>
      <span className={`${tw.text.primary} break-all`}>{value}</span>
    </div>
  )
}
