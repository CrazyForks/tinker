const ELECTRON_PATTERN = / Electron\/[\d.]+/g
const APP_NAME_PATTERN = / TINKER\/[\d.]+/g

export function cleanUserAgent(ua: string): string {
  return ua.replace(ELECTRON_PATTERN, '').replace(APP_NAME_PATTERN, '')
}
