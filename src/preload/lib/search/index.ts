import isWindows from 'licia/isWindows'
import isMac from 'licia/isMac'
import trim from 'licia/trim'
import { searchFile as searchFileMac } from './mac'
import { searchFile as searchFileWin } from './win'

export interface SearchFileResult {
  path: string
  size: number
  dateModified: number
}

export interface SearchFileOptions {
  offset?: number
  maxResults?: number
}

export async function searchFile(
  query: string,
  options: SearchFileOptions = {}
): Promise<SearchFileResult[]> {
  const { offset = 0, maxResults = 50 } = options
  const trimmed = trim(query)
  if (!trimmed) return []

  if (isWindows) {
    return searchFileWin(trimmed, offset, maxResults)
  }

  if (isMac) {
    return searchFileMac(trimmed, offset, maxResults)
  }

  return []
}
