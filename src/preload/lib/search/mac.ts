import { execFile } from 'child_process'
import trim from 'licia/trim'
import startWith from 'licia/startWith'
import toInt from 'licia/toInt'
import filter from 'licia/filter'
import { SearchFileResult } from './index'

export function searchFile(
  query: string,
  offset: number,
  maxResults: number
): Promise<SearchFileResult[]> {
  return new Promise((resolve) => {
    const args = [
      '-name',
      query,
      '-0',
      '-attr',
      'kMDItemFSSize',
      '-attr',
      'kMDItemFSContentChangeDate',
    ]

    execFile('mdfind', args, { encoding: 'utf8' }, (error, stdout) => {
      if (error) {
        resolve([])
        return
      }

      try {
        const results = parseMdfindOutput(stdout)
        resolve(results.slice(offset, offset + maxResults))
      } catch {
        resolve([])
      }
    })
  })
}

function parseMdfindOutput(output: string): SearchFileResult[] {
  const entries = filter(output.split('\0'), (entry) => trim(entry).length > 0)
  const results: SearchFileResult[] = []

  for (const entry of entries) {
    const parts = entry.split(/\s+(?=kMD)/)
    const filePath = trim(parts[0])
    if (!filePath) continue

    let size = 0
    let dateModified = 0

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i]
      if (startWith(part, 'kMDItemFSSize')) {
        const val = extractAttrValue(part)
        size = val !== null ? toInt(val) : 0
      } else if (startWith(part, 'kMDItemFSContentChangeDate')) {
        const val = extractAttrValue(part)
        dateModified = val !== null ? new Date(val).getTime() || 0 : 0
      }
    }

    results.push({ path: filePath, size, dateModified })
  }

  return results
}

function extractAttrValue(attr: string): string | null {
  const eqIndex = attr.indexOf(' = ')
  if (eqIndex === -1) return null
  const val = trim(attr.slice(eqIndex + 3))
  return val === '(null)' ? null : val
}
