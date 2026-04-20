import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { registerFormHandlers } from './ipc/form.ipc'
import { registerFileHandlers } from './ipc/file.ipc'
import { registerExportHandlers } from './ipc/export.ipc'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null

function getIconPath(): string {
  if (isDev) {
    return path.join(__dirname, '../build/icon.png')
  }
  return path.join(process.resourcesPath, 'icon.png')
}

function createWindow() {
  const iconPath = getIconPath()
  const iconExists = fs.existsSync(iconPath)

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#1e1f2e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
    ...(iconExists ? { icon: iconPath } : {}),
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    if (isDev) mainWindow?.webContents.openDevTools({ mode: 'detach' })
  })

  mainWindow.on('maximize', () => mainWindow?.webContents.send('window:maximized', true))
  mainWindow.on('unmaximize', () => mainWindow?.webContents.send('window:maximized', false))

  mainWindow.on('closed', () => { mainWindow = null })

  buildMenu()
}

function buildMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { label: 'New Form', accelerator: 'CmdOrCtrl+N', click: () => mainWindow?.webContents.send('menu:new-form') },
        { type: 'separator' },
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => mainWindow?.webContents.send('menu:save') },
        { label: 'Save As', accelerator: 'CmdOrCtrl+Shift+S', click: () => mainWindow?.webContents.send('menu:save-as') },
        { type: 'separator' },
        { label: 'Export PDF', accelerator: 'CmdOrCtrl+E', click: () => mainWindow?.webContents.send('menu:export-pdf') },
        { label: 'Print', accelerator: 'CmdOrCtrl+P', click: () => mainWindow?.webContents.send('menu:print') },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Toggle Theme', click: () => mainWindow?.webContents.send('menu:toggle-theme') },
        { label: 'Preview Form', accelerator: 'CmdOrCtrl+Shift+P', click: () => mainWindow?.webContents.send('menu:preview') },
        { type: 'separator' },
        { label: 'Reload', role: 'reload' },
        ...(isDev ? [{ label: 'Toggle DevTools', accelerator: 'F12', role: 'toggleDevTools' as const }] : []),
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Formora',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: 'info',
              title: 'About Formora',
              message: 'Formora v1.0.0',
              detail: 'Premium Form Builder\n\nDeveloped by Faizan Mir\nGrey Phoenix Studios\nmirfaizan8803@gmail.com',
            })
          },
        },
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// Window controls
ipcMain.on('window:minimize', () => mainWindow?.minimize())
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize()
  else mainWindow?.maximize()
})
ipcMain.on('window:close', () => mainWindow?.close())
ipcMain.handle('window:is-maximized', () => mainWindow?.isMaximized() ?? false)

app.whenReady().then(() => {
  // Create data directory after app is ready
  const dataDir = path.join(app.getPath('userData'), 'forms')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

  registerFormHandlers(dataDir)
  registerFileHandlers()
  registerExportHandlers()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
