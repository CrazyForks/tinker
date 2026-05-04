import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import NavList from 'share/components/NavList'
import fileSize from 'licia/fileSize'
import { tw } from 'share/theme'
import store from '../store'
import { categories } from '../lib/rules'
import type { Category } from '../types'

export default observer(function Sidebar() {
  const { t } = useTranslation()

  const items = categories.map((cat) => {
    const size =
      cat.id === 'all'
        ? store.totalScannedSize
        : store.getCategorySize(cat.id as Category)
    return {
      id: cat.id,
      label: t(cat.nameKey),
      suffix:
        size > 0 ? (
          <span className={`text-xs tabular-nums ${tw.text.secondary}`}>
            {fileSize(size)}
          </span>
        ) : undefined,
    }
  })

  return (
    <div
      className={`w-36 ${tw.bg.tertiary} border-r ${tw.border} flex flex-col flex-shrink-0`}
    >
      <div className="flex-1 overflow-y-auto">
        <NavList
          items={items}
          activeId={store.activeCategory}
          onSelect={(id) => store.setActiveCategory(id as Category | 'all')}
        />
      </div>
    </div>
  )
})
