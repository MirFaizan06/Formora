export interface ElectronAPI {
  // Window
  minimize(): void
  maximize(): void
  close(): void
  isMaximized(): Promise<boolean>
  onWindowMaximized(cb: (maximized: boolean) => void): () => void

  // Forms
  saveForms(forms: unknown): Promise<{ success: boolean; error?: string }>
  loadForms(): Promise<unknown[]>
  saveForm(form: unknown): Promise<{ success: boolean; error?: string }>
  deleteForm(id: string): Promise<{ success: boolean; error?: string }>

  // Dialogs
  showSaveDialog(options: {
    defaultPath?: string
    filters?: { name: string; extensions: string[] }[]
  }): Promise<string | null>
  showOpenDialog(options: {
    filters?: { name: string; extensions: string[] }[]
  }): Promise<string[] | null>

  // Export
  exportPDF(data: { filePath: string; buffer: number[] }): Promise<{ success: boolean }>
  print(options: unknown): Promise<{ success: boolean }>

  // Menu events
  onMenuEvent(channel: string, callback: () => void): () => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export function useElectron(): ElectronAPI | null {
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI
  }
  return null
}
