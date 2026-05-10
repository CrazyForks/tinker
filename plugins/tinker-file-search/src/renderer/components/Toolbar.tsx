import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { Toolbar, ToolbarSearch, ToolbarSpacer } from 'share/components/Toolbar'
import { LoadingCircle } from 'share/components/Loading'
import store from '../store'

export default observer(function ToolbarComponent() {
  const { t } = useTranslation()

  return (
    <Toolbar>
      <ToolbarSearch
        value={store.query}
        onChange={(value) => store.setQuery(value)}
        placeholder={t('searchPlaceholder')}
      />
      {store.searching && <LoadingCircle className="w-5 h-5 ml-1" />}
      <ToolbarSpacer />
    </Toolbar>
  )
})
