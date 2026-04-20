export interface ShortcutDef {
  id: string
  label: string
  category: string
  defaultKeys: string[] // e.g. ['Ctrl', 'N']
}

export const DEFAULT_SHORTCUTS: ShortcutDef[] = [
  // General
  { id: 'new-form',       label: 'New Form',           category: 'General',  defaultKeys: ['Ctrl', 'N'] },
  { id: 'save',           label: 'Save',               category: 'General',  defaultKeys: ['Ctrl', 'S'] },
  { id: 'export-pdf',     label: 'Export PDF',         category: 'General',  defaultKeys: ['Ctrl', 'E'] },
  { id: 'print',          label: 'Print',              category: 'General',  defaultKeys: ['Ctrl', 'P'] },
  { id: 'open-settings',  label: 'Open Settings',      category: 'General',  defaultKeys: ['Ctrl', ','] },
  { id: 'toggle-sidebar', label: 'Toggle Sidebar',     category: 'General',  defaultKeys: ['Ctrl', 'B'] },
  { id: 'show-shortcuts', label: 'Show Shortcuts',     category: 'General',  defaultKeys: ['?'] },
  // Builder
  { id: 'preview-mode',   label: 'Toggle Preview',     category: 'Builder',  defaultKeys: ['Ctrl', 'Shift', 'P'] },
  { id: 'delete-field',   label: 'Delete Selected Field', category: 'Builder', defaultKeys: ['Delete'] },
  { id: 'duplicate-field',label: 'Duplicate Field',    category: 'Builder',  defaultKeys: ['Ctrl', 'D'] },
  { id: 'deselect',       label: 'Deselect / Close',   category: 'Builder',  defaultKeys: ['Escape'] },
  { id: 'next-page',      label: 'Next Page',          category: 'Builder',  defaultKeys: ['Ctrl', 'ArrowRight'] },
  { id: 'prev-page',      label: 'Previous Page',      category: 'Builder',  defaultKeys: ['Ctrl', 'ArrowLeft'] },
  { id: 'add-page',       label: 'Add Page',           category: 'Builder',  defaultKeys: ['Ctrl', 'Shift', 'N'] },
]

const STORAGE_KEY = 'formora:keybindings'

type UserBindings = Record<string, string[]>

function readUserBindings(): UserBindings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function writeUserBindings(b: UserBindings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(b))
  } catch {}
}

class ShortcutsService {
  private userBindings: UserBindings = readUserBindings()
  private listeners: Array<() => void> = []

  getAll(): Array<ShortcutDef & { keys: string[]; isCustom: boolean }> {
    return DEFAULT_SHORTCUTS.map((s) => ({
      ...s,
      keys: this.userBindings[s.id] ?? s.defaultKeys,
      isCustom: !!this.userBindings[s.id],
    }))
  }

  getKeys(id: string): string[] {
    return this.userBindings[id] ?? DEFAULT_SHORTCUTS.find((s) => s.id === id)?.defaultKeys ?? []
  }

  setKeys(id: string, keys: string[]): void {
    this.userBindings[id] = keys
    writeUserBindings(this.userBindings)
    this.notify()
  }

  resetKeys(id: string): void {
    delete this.userBindings[id]
    writeUserBindings(this.userBindings)
    this.notify()
  }

  resetAll(): void {
    this.userBindings = {}
    writeUserBindings(this.userBindings)
    this.notify()
  }

  subscribe(fn: () => void): () => void {
    this.listeners.push(fn)
    return () => { this.listeners = this.listeners.filter((l) => l !== fn) }
  }

  private notify() {
    this.listeners.forEach((fn) => fn())
  }

  /** Check if a KeyboardEvent matches a shortcut's keys. */
  matches(e: KeyboardEvent, keys: string[]): boolean {
    const ctrl = keys.includes('Ctrl') === (e.ctrlKey || e.metaKey)
    const shift = keys.includes('Shift') === e.shiftKey
    const alt = keys.includes('Alt') === e.altKey
    const key = keys.filter((k) => !['Ctrl', 'Shift', 'Alt'].includes(k))[0] ?? ''
    const eKey = e.key === ' ' ? 'Space' : e.key
    return ctrl && shift && alt && eKey.toLowerCase() === key.toLowerCase()
  }

  matchesId(e: KeyboardEvent, id: string): boolean {
    return this.matches(e, this.getKeys(id))
  }
}

export const shortcutsService = new ShortcutsService()
