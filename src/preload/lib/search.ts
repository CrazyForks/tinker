import { exec } from 'child_process'
import isWindows from 'licia/isWindows'
import { resolveResources } from './util'

export interface SearchFileResult {
  path: string
  size: number
  dateModified: number
}

export interface SearchFileOptions {
  offset?: number
  maxResults?: number
}

const esPath = resolveResources('everything/es.exe')
const everythingPath = resolveResources('everything/everything.exe')

function isEverythingReady(): Promise<boolean> {
  return new Promise((resolve) => {
    exec(
      `"${esPath}" -get-everything-version`,
      { windowsHide: true },
      (error, stdout) => {
        resolve(!error && stdout.trim().length > 0)
      }
    )
  })
}

async function ensureEverythingRunning(): Promise<void> {
  const ready = await isEverythingReady()
  if (ready) return

  exec(
    `powershell -Command "Start-Process -FilePath '${everythingPath}' -WindowStyle Hidden"`,
    { windowsHide: true }
  )

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    if (await isEverythingReady()) return
  }
}

function escapeForCmd(str: string): string {
  return str.replace(/([\\&|><^])/g, '^$1')
}

export async function searchFile(
  query: string,
  options: SearchFileOptions = {}
): Promise<SearchFileResult[]> {
  if (isWindows) {
    const { offset = 0, maxResults = 50 } = options
    if (!query || !query.trim()) return []

    await ensureEverythingRunning()

    const escaped = escapeForCmd(query.trim())
    const cmd = `chcp 65001>nul && "${esPath}" -json -size -date-modified -offset ${offset} -max-results ${maxResults} ${escaped}`

    return new Promise((resolve) => {
      exec(cmd, { windowsHide: true, encoding: 'utf8' }, (error, stdout) => {
        if (error) {
          resolve([])
          return
        }

        try {
          const items = JSON.parse(stdout)
          const results: SearchFileResult[] = items.map((item: any) => ({
            path: item.filename,
            size: item.size || 0,
            dateModified: filetimeToTimestamp(item.date_modified),
          }))
          resolve(results)
        } catch {
          resolve([])
        }
      })
    })
  }

  return []
}

// Convert Windows FILETIME (100ns since 1601-01-01) to Unix timestamp (ms)
function filetimeToTimestamp(filetime: number): number {
  return Math.floor(filetime / 10000) - 11644473600000
}
