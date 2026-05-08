import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useMemo, useCallback, useEffect } from 'react'
import type {
  ColDef,
  ICellRendererParams,
  RowDoubleClickedEvent,
  CellContextMenuEvent,
} from 'ag-grid-community'
import fileSize from 'licia/fileSize'
import dateFormat from 'licia/dateFormat'
import Grid from 'share/components/Grid'
import store from '../store'
import type { FileResult } from '../types'

const NameCell = observer(function NameCell({
  data,
}: ICellRendererParams<FileResult>) {
  if (!data) return null

  useEffect(() => {
    if (!store.iconCache.has(data.path)) {
      store.loadFileIcon(data.path)
    }
  }, [data.path])

  const icon = store.iconCache.get(data.path)
  const name = data.path.split(/[\\/]/).pop() || data.path

  return (
    <div className="flex items-center gap-2">
      {icon ? (
        <img src={icon} alt="" className="w-4 h-4 flex-shrink-0" />
      ) : (
        <span className="w-4 h-4 flex-shrink-0" />
      )}
      <span className="truncate">{name}</span>
    </div>
  )
})

const PathCell = ({ data }: ICellRendererParams<FileResult>) => {
  if (!data) return null

  const dir = data.path.replace(/[\\/][^\\/]+$/, '')

  return (
    <span className="truncate" title={data.path}>
      {dir}
    </span>
  )
}

export default observer(function ResultView() {
  const { t } = useTranslation()

  const columnDefs: ColDef<FileResult>[] = useMemo(
    () => [
      {
        field: 'path',
        headerName: t('fileName'),
        flex: 2,
        minWidth: 150,
        sortable: false,
        cellRenderer: NameCell,
      },
      {
        field: 'path',
        headerName: t('filePath'),
        flex: 3,
        minWidth: 200,
        sortable: false,
        cellRenderer: PathCell,
        colId: 'pathCol',
      },
      {
        field: 'size',
        headerName: t('fileSize'),
        width: 100,
        sortable: false,
        cellStyle: { textAlign: 'right' },
        valueFormatter: (params) =>
          params.value ? fileSize(params.value) : '',
      },
      {
        field: 'dateModified',
        headerName: t('dateModified'),
        width: 150,
        sortable: false,
        valueFormatter: (params) =>
          params.value
            ? dateFormat(new Date(params.value), 'yyyy-mm-dd HH:MM')
            : '',
      },
    ],
    [t]
  )

  const getRowId = useCallback(
    (params: { data: FileResult }) => params.data.path,
    []
  )

  const onRowDoubleClicked = useCallback(
    (event: RowDoubleClickedEvent<FileResult>) => {
      if (event.data) {
        store.showInFolder(event.data.path)
      }
    },
    []
  )

  const onCellContextMenu = useCallback(
    (event: CellContextMenuEvent<FileResult>) => {
      if (!event.data) return
      const filePath = event.data.path
      const e = event.event as MouseEvent
      tinker.showContextMenu(e.clientX, e.clientY, [
        {
          label: t('showInFolder'),
          click: () => store.showInFolder(filePath),
        },
        {
          label: t('copyPath'),
          click: () => store.copyPath(filePath),
        },
      ])
    },
    [t]
  )

  return (
    <div className="flex-1 overflow-hidden">
      <Grid<FileResult>
        isDark={store.isDark}
        columnDefs={columnDefs}
        rowData={store.results}
        getRowId={getRowId}
        onRowDoubleClicked={onRowDoubleClicked}
        onCellContextMenu={onCellContextMenu}
        enableCellTextSelection={true}
        suppressCellFocus={true}
        overlayNoRowsTemplate={`<span>${t('noResults')}</span>`}
      />
    </div>
  )
})
