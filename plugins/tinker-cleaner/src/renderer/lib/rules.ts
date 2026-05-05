import type { Category } from '../types'

export interface RuleDef {
  id: string
  category: Category
  nameKey: string
  pathTemplate: string
}

const rules: RuleDef[] = [
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

export function resolveRules(homePath: string): RuleDef[] {
  return rules.map((rule) => ({
    ...rule,
    pathTemplate: rule.pathTemplate.replace('~', homePath),
  }))
}

export const categories: { id: Category | 'all'; nameKey: string }[] = [
  { id: 'all', nameKey: 'category.all' },
  { id: 'system', nameKey: 'category.system' },
  { id: 'userCache', nameKey: 'category.userCache' },
  { id: 'browser', nameKey: 'category.browser' },
  { id: 'devTools', nameKey: 'category.devTools' },
  { id: 'app', nameKey: 'category.app' },
]
