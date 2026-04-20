import { contextBridge, ipcRenderer } from 'electron'

const VALID_MENU_CHANNELS = [
  'menu:new-form',
  'menu:save',
  'menu:save-as',
  'menu:export-pdf',
  'menu:print',
  'menu:toggle-theme',
  'menu:preview',
]

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Window controls ──────────────────────────────────────────────────────
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),

  // ── Form persistence ─────────────────────────────────────────────────────
  saveForms: (forms: unknown) => ipcRenderer.invoke('form:save-all', forms),
  loadForms: () => ipcRenderer.invoke('form:load-all'),
  saveForm: (form: unknown) => ipcRenderer.invoke('form:save', form),
  deleteForm: (id: string) => ipcRenderer.invoke('form:delete', id),

  // ── File dialogs ─────────────────────────────────────────────────────────
  showSaveDialog: (options: unknown) => ipcRenderer.invoke('file:save-dialog', options),
  showOpenDialog: (options: unknown) => ipcRenderer.invoke('file:open-dialog', options),

  // ── Export ───────────────────────────────────────────────────────────────
  exportPDF: (data: unknown) => ipcRenderer.invoke('export:pdf', data),
  print: (options: unknown) => ipcRenderer.invoke('export:print', options),

  // ── Menu events ──────────────────────────────────────────────────────────
  onMenuEvent: (channel: string, callback: () => void) => {
    if (!VALID_MENU_CHANNELS.includes(channel)) return () => {}
    const handler = () => callback()
    ipcRenderer.on(channel, handler)
    return () => ipcRenderer.removeListener(channel, handler)
  },

  // ── Window state events ──────────────────────────────────────────────────
  onWindowMaximized: (callback: (maximized: boolean) => void) => {
    const handler = (_: unknown, val: boolean) => callback(val)
    ipcRenderer.on('window:maximized', handler)
    return () => ipcRenderer.removeListener('window:maximized', handler)
  },
})
