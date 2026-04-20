import { ipcMain, BrowserWindow } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

export function registerExportHandlers() {
  ipcMain.handle('export:pdf', async (_event, data: { filePath: string; buffer: number[] }) => {
    try {
      const buf = Buffer.from(data.buffer)
      fs.writeFileSync(data.filePath, buf)
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  })

  ipcMain.handle('export:print', async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return { success: false }
    return new Promise((resolve) => {
      win.webContents.print({ silent: false, printBackground: true }, (success) => {
        resolve({ success })
      })
    })
  })
}
