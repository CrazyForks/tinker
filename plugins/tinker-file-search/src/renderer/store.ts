import { makeAutoObservable, runInAction } from 'mobx'
import debounce from 'licia/debounce'
import BaseStore from 'share/BaseStore'
import { getFileIcon } from 'share/lib/util'
import type { FileResult } from './types'

const MAX_RESULTS = 100

class Store extends BaseStore {
  query = ''
  results: FileResult[] = []
  searching = false
  hasMore = false
  iconCache: Map<string, string> = new Map()

  private debounceSearch = debounce(() => this.search(), 300)

  constructor() {
    super()
    makeAutoObservable(this)
  }

  setQuery(query: string) {
    this.query = query
    this.debounceSearch()
  }

  async search() {
    const query = this.query.trim()
    if (!query) {
      this.results = []
      this.hasMore = false
      return
    }

    this.searching = true

    try {
      const results = await tinker.searchFile(query, {
        offset: 0,
        maxResults: MAX_RESULTS,
      })
      runInAction(() => {
        this.results = results
        this.hasMore = results.length >= MAX_RESULTS
        this.searching = false
      })
    } catch {
      runInAction(() => {
        this.results = []
        this.hasMore = false
        this.searching = false
      })
    }
  }

  async loadMore() {
    const query = this.query.trim()
    if (!query || this.searching || !this.hasMore) return

    this.searching = true

    try {
      const results = await tinker.searchFile(query, {
        offset: this.results.length,
        maxResults: MAX_RESULTS,
      })
      runInAction(() => {
        this.results = [...this.results, ...results]
        this.hasMore = results.length >= MAX_RESULTS
        this.searching = false
      })
    } catch {
      runInAction(() => {
        this.searching = false
      })
    }
  }

  async loadFileIcon(filePath: string) {
    if (this.iconCache.has(filePath)) return

    const icon = await getFileIcon(filePath)
    if (icon) {
      runInAction(() => {
        this.iconCache.set(filePath, icon)
      })
    }
  }

  showInFolder(filePath: string) {
    tinker.showItemInPath(filePath)
  }

  copyPath(filePath: string) {
    navigator.clipboard.writeText(filePath)
  }

  async deleteFile(filePath: string) {
    try {
      await fileSearch.deleteFile(filePath)
      runInAction(() => {
        this.results = this.results.filter((r) => r.path !== filePath)
      })
    } catch {
      // ignore
    }
  }
}

export default new Store()
