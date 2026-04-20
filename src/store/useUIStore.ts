import { create } from 'zustand'
import { AppView } from '../types/form.types'

export type Theme = 'dark' | 'light' | 'crimson' | 'forest' | 'midnight'
export const ALL_THEMES: Theme[] = ['dark', 'light', 'crimson', 'forest', 'midnight']

const THEME_KEY = 'formora:theme'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null
    if (stored && ALL_THEMES.includes(stored)) return stored
  } catch {
    // localStorage unavailable
  }
  return 'dark'
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {}
}

const initialTheme = readStoredTheme()
applyTheme(initialTheme)

interface UIStore {
  theme: Theme
  view: AppView
  sidebarCollapsed: boolean
  propertiesPanelOpen: boolean
  searchQuery: string
  isLoading: boolean
  previewMode: boolean

  setTheme(theme: Theme): void
  toggleTheme(): void
  setView(view: AppView): void
  toggleSidebar(): void
  togglePropertiesPanel(): void
  setSearchQuery(q: string): void
  setLoading(v: boolean): void
  togglePreviewMode(): void
  setPreviewMode(v: boolean): void
}

export const useUIStore = create<UIStore>((set, get) => ({
  theme: initialTheme,
  view: 'explorer',
  sidebarCollapsed: false,
  propertiesPanelOpen: true,
  searchQuery: '',
  isLoading: false,
  previewMode: false,

  setTheme: (theme) => {
    applyTheme(theme)
    persistTheme(theme)
    set({ theme })
  },

  toggleTheme: () => {
    const idx = ALL_THEMES.indexOf(get().theme)
    const next = ALL_THEMES[(idx + 1) % ALL_THEMES.length]
    applyTheme(next)
    persistTheme(next)
    set({ theme: next })
  },

  setView: (view) => set({ view }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  togglePropertiesPanel: () => set((state) => ({ propertiesPanelOpen: !state.propertiesPanelOpen })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setLoading: (v) => set({ isLoading: v }),
  togglePreviewMode: () => set((state) => ({ previewMode: !state.previewMode })),
  setPreviewMode: (v) => set({ previewMode: v }),
}))
