import base64 from 'licia/base64'
import isDataUrl from 'licia/isDataUrl'
import dataUrl from 'licia/dataUrl'

export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  return base64.encode(bytes)
}

export function base64ToUint8Array(base64Str: string): Uint8Array {
  const trimmed = base64Str.trim()
  let clean = trimmed

  if (isDataUrl(trimmed)) {
    const parsed = dataUrl.parse(trimmed)
    if (parsed) {
      clean = parsed.data
    }
  }

  let byteArray: number[]
  try {
    byteArray = base64.decode(clean)
  } catch (error) {
    console.error('Invalid base64 string:', error)
    throw error
  }

  return new Uint8Array(byteArray)
}
