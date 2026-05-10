import { contextBridge, shell } from 'electron'

const fileSearchObj = {
  async deleteFile(filePath: string): Promise<void> {
    await shell.trashItem(filePath)
  },
}

contextBridge.exposeInMainWorld('fileSearch', fileSearchObj)

declare global {
  const fileSearch: typeof fileSearchObj
}
