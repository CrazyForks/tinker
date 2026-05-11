import { contextBridge, shell } from 'electron'
import { promises as fs } from 'fs'

const fileSearchObj = {
  async deleteFile(filePath: string, moveToTrash: boolean): Promise<void> {
    if (moveToTrash) {
      await shell.trashItem(filePath)
    } else {
      await fs.unlink(filePath)
    }
  },
}

contextBridge.exposeInMainWorld('fileSearch', fileSearchObj)

declare global {
  const fileSearch: typeof fileSearchObj
}
