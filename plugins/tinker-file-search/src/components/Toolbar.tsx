import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import {
  Toolbar as ToolbarBase,
  ToolbarSpacer,
  ToolbarTextButton,
  TOOLBAR_ICON_SIZE,
} from 'share/components/Toolbar'
import { tw } from 'share/theme'
import store from '../store'

export default observer(function Toolbar() {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <ToolbarBase>
      <Search size={TOOLBAR_ICON_SIZE} className={tw.text.secondary} />
      <input
        ref={inputRef}
        className={`flex-1 mx-2 px-2 py-1 text-sm bg-transparent outline-none ${tw.text.primary}`}
        placeholder={t('searchPlaceholder')}
        value={store.query}
        onChange={(e) => store.setQuery(e.target.value)}
      />
      <ToolbarSpacer />
      {store.searching && (
        <span className={`text-xs ${tw.text.secondary} mr-2`}>
          {t('searching')}
        </span>
      )}
      {!store.searching && store.results.length > 0 && (
        <span className={`text-xs ${tw.text.secondary} mr-2`}>
          {t('resultCount', { count: store.results.length })}
        </span>
      )}
      {store.hasMore && !store.searching && (
        <ToolbarTextButton onClick={() => store.loadMore()}>
          {t('loadMore')}
        </ToolbarTextButton>
      )}
    </ToolbarBase>
  )
})
