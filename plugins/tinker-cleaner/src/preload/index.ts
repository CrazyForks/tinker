import { contextBridge, shell } from 'electron'
import { promises as fs } from 'fs'
import * as path from 'path'
import * as os from 'os'

type Category = 'system' | 'userCache' | 'browser' | 'devTools' | 'app'

interface RuleDef {
  id: string
  category: Category
  nameKey: string
  pathTemplate: string
}

const macRules: RuleDef[] = [
  // System
  {
    id: 'sys-tmp',
    category: 'system',
    nameKey: 'rule.sysTmp',
    pathTemplate: '/private/tmp',
  },
  {
    id: 'sys-log',
    category: 'system',
    nameKey: 'rule.sysLog',
    pathTemplate: '/private/var/log',
  },
  {
    id: 'sys-diagnostics',
    category: 'system',
    nameKey: 'rule.sysDiagnostics',
    pathTemplate: '/private/var/db/diagnostics',
  },
  {
    id: 'sys-powerlog',
    category: 'system',
    nameKey: 'rule.sysPowerlog',
    pathTemplate: '/private/var/db/powerlog',
  },
  {
    id: 'sys-crash-reports',
    category: 'system',
    nameKey: 'rule.sysCrashReports',
    pathTemplate: '/Library/Logs/DiagnosticReports',
  },
  {
    id: 'sys-updates',
    category: 'system',
    nameKey: 'rule.sysUpdates',
    pathTemplate: '/Library/Updates',
  },

  // User cache
  {
    id: 'user-caches',
    category: 'userCache',
    nameKey: 'rule.userCaches',
    pathTemplate: '~/Library/Caches',
  },
  {
    id: 'user-logs',
    category: 'userCache',
    nameKey: 'rule.userLogs',
    pathTemplate: '~/Library/Logs',
  },
  {
    id: 'user-helpd',
    category: 'userCache',
    nameKey: 'rule.userHelpd',
    pathTemplate: '~/Library/Caches/com.apple.helpd',
  },
  {
    id: 'user-geo',
    category: 'userCache',
    nameKey: 'rule.userGeo',
    pathTemplate: '~/Library/Caches/GeoServices',
  },
  {
    id: 'sandbox-wallpaper',
    category: 'userCache',
    nameKey: 'rule.sandboxWallpaper',
    pathTemplate:
      '~/Library/Containers/com.apple.wallpaper.agent/Data/Library/Caches',
  },
  {
    id: 'sandbox-mediaanalysis',
    category: 'userCache',
    nameKey: 'rule.sandboxMediaAnalysis',
    pathTemplate:
      '~/Library/Containers/com.apple.mediaanalysisd/Data/Library/Caches',
  },
  {
    id: 'sandbox-appstore',
    category: 'userCache',
    nameKey: 'rule.sandboxAppStore',
    pathTemplate: '~/Library/Containers/com.apple.AppStore/Data/Library/Caches',
  },
  {
    id: 'xcode-doc-cache',
    category: 'userCache',
    nameKey: 'rule.xcodeDocCache',
    pathTemplate: '~/Library/Developer/Xcode/DocumentationCache',
  },

  // Browser
  {
    id: 'chrome-cache',
    category: 'browser',
    nameKey: 'rule.chromeCache',
    pathTemplate: '~/Library/Caches/Google/Chrome',
  },
  {
    id: 'chrome-app-support',
    category: 'browser',
    nameKey: 'rule.chromeAppSupport',
    pathTemplate: '~/Library/Application Support/Google/Chrome',
  },
  {
    id: 'puppeteer',
    category: 'browser',
    nameKey: 'rule.puppeteer',
    pathTemplate: '~/.cache/puppeteer',
  },

  // Dev tools
  {
    id: 'npm-cacache',
    category: 'devTools',
    nameKey: 'rule.npmCacache',
    pathTemplate: '~/.npm/_cacache',
  },
  {
    id: 'npm-npx',
    category: 'devTools',
    nameKey: 'rule.npmNpx',
    pathTemplate: '~/.npm/_npx',
  },
  {
    id: 'yarn-cache',
    category: 'devTools',
    nameKey: 'rule.yarnCache',
    pathTemplate: '~/Library/Caches/Yarn',
  },
  {
    id: 'bun-cache',
    category: 'devTools',
    nameKey: 'rule.bunCache',
    pathTemplate: '~/.bun/install/cache',
  },
  {
    id: 'pip-cache',
    category: 'devTools',
    nameKey: 'rule.pipCache',
    pathTemplate: '~/Library/Caches/pip',
  },
  {
    id: 'cargo-registry',
    category: 'devTools',
    nameKey: 'rule.cargoRegistry',
    pathTemplate: '~/.cargo/registry/cache',
  },
  {
    id: 'gradle-caches',
    category: 'devTools',
    nameKey: 'rule.gradleCaches',
    pathTemplate: '~/.gradle/caches',
  },
  {
    id: 'huggingface',
    category: 'devTools',
    nameKey: 'rule.huggingface',
    pathTemplate: '~/.cache/huggingface',
  },
  {
    id: 'homebrew',
    category: 'devTools',
    nameKey: 'rule.homebrew',
    pathTemplate: '~/Library/Caches/Homebrew',
  },

  // App
  {
    id: 'vscode-cached-data',
    category: 'app',
    nameKey: 'rule.vscodeCachedData',
    pathTemplate: '~/Library/Application Support/Code/CachedData',
  },
  {
    id: 'vscode-cache',
    category: 'app',
    nameKey: 'rule.vscodeCache',
    pathTemplate: '~/Library/Application Support/Code/Cache',
  },
]

const winRules: RuleDef[] = [
  // System
  {
    id: 'win-tmp',
    category: 'system',
    nameKey: 'rule.sysTmp',
    pathTemplate: '%TEMP%',
  },
  {
    id: 'win-log',
    category: 'system',
    nameKey: 'rule.sysLog',
    pathTemplate: '%WINDIR%\\Logs',
  },

  // Browser
  {
    id: 'win-chrome-service-worker',
    category: 'browser',
    nameKey: 'rule.chromeServiceWorker',
    pathTemplate:
      '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Service Worker\\CacheStorage',
  },
  {
    id: 'win-edge-service-worker',
    category: 'browser',
    nameKey: 'rule.edgeServiceWorker',
    pathTemplate:
      '%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Service Worker\\CacheStorage',
  },

  // App
  {
    id: 'win-steam-htmlcache',
    category: 'app',
    nameKey: 'rule.steamHtmlCache',
    pathTemplate: '%LOCALAPPDATA%\\Steam\\htmlcache\\Cache',
  },
  {
    id: 'win-steam-code-cache',
    category: 'app',
    nameKey: 'rule.steamCodeCache',
    pathTemplate: '%LOCALAPPDATA%\\Steam\\htmlcache\\Code Cache',
  },

  // Dev tools
  {
    id: 'win-vscode-cache',
    category: 'devTools',
    nameKey: 'rule.vscodeCache',
    pathTemplate: '%APPDATA%\\Code\\Cache',
  },
  {
    id: 'win-vscode-cached-data',
    category: 'devTools',
    nameKey: 'rule.vscodeCachedData',
    pathTemplate: '%APPDATA%\\Code\\CachedData',
  },
]

function resolveRules(): {
  id: string
  category: Category
  nameKey: string
  path: string
}[] {
  const platform = os.platform()
  if (platform === 'win32') {
    return winRules.map((rule) => ({
      id: rule.id,
      category: rule.category,
      nameKey: rule.nameKey,
      path: rule.pathTemplate.replace(
        /%([^%]+)%/g,
        (_, key: string) => process.env[key.toUpperCase()] || `%${key}%`
      ),
    }))
  }
  if (platform === 'darwin') {
    const home = os.homedir()
    return macRules.map((rule) => ({
      id: rule.id,
      category: rule.category,
      nameKey: rule.nameKey,
      path: rule.pathTemplate.replace('~', home),
    }))
  }
  return []
}

const cleanerObj = {
  async cleanPath(
    targetPath: string,
    moveToTrash: boolean
  ): Promise<{ cleaned: number; errors: string[] }> {
    let cleaned = 0
    const errors: string[] = []

    try {
      const stat = await fs.stat(targetPath)
      if (!stat.isDirectory()) {
        try {
          if (moveToTrash) {
            await shell.trashItem(targetPath)
          } else {
            await fs.unlink(targetPath)
          }
          cleaned++
        } catch {
          errors.push(targetPath)
        }
        return { cleaned, errors }
      }
    } catch {
      return { cleaned, errors }
    }

    try {
      const entries = await fs.readdir(targetPath, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(targetPath, entry.name)
        try {
          if (moveToTrash) {
            await shell.trashItem(fullPath)
          } else if (entry.isDirectory()) {
            await fs.rm(fullPath, { recursive: true, force: true })
          } else {
            await fs.unlink(fullPath)
          }
          cleaned++
        } catch {
          errors.push(fullPath)
        }
      }
    } catch {
      errors.push(targetPath)
    }

    return { cleaned, errors }
  },

  getRules() {
    return resolveRules()
  },
}

contextBridge.exposeInMainWorld('cleaner', cleanerObj)

declare global {
  const cleaner: typeof cleanerObj
}
