# Formora

**Premium desktop form builder by Grey Phoenix Studios**

Build beautiful printable forms. Export anywhere. Everything stays local.

---

## Features

### Form Builder
- Visual drag-and-drop canvas (VSCode-style layout)
- 18 field types across 4 categories:
  - **Layout** — Form Header, Divider, Label
  - **Basic** — Text, Textarea, Number, Email, Phone, Date, Time
  - **Selection** — Checkbox, Checkbox Group, Radio, Dropdown, Rating
  - **Advanced** — Address, Fill-in-Blank, Signature, Table
- Field palette search filter
- Click or drag fields onto the canvas
- Select a field → tweak every detail in the Properties Panel
- Inline span-width nudge buttons (column grid: 1–12)
- Drag the grip handle to reorder fields
- Ctrl+D to duplicate, Delete to remove
- Multi-page support with inline tab rename + drag reorder

### Preview & Export
- Toggle Preview mode to fill out the form as a user (Ctrl+Shift+P)
- Export to clean multi-page PDF (pdf-lib)
- Print via Electron print API

### Themes
5 built-in color themes (all CSS-variable based, live-switchable):
- Dark · Light · Crimson · Forest · Midnight

### Sounds
- Startup chime after splash screen
- Warning sound on confirmation dialogs
- Success / Error feedback sounds
- **Custom sounds** — upload your own MP3 (< 2 MB) per event
- Global sound toggle

### Keyboard Shortcuts
| Shortcut | Action |
|---|---|
| Ctrl+N | New Form |
| Ctrl+S | Save |
| Ctrl+E | Export PDF |
| Ctrl+B | Toggle Sidebar |
| Ctrl+, | Open Settings |
| Ctrl+Shift+P | Toggle Preview |
| Ctrl+D | Duplicate Field |
| Delete | Delete Selected Field |
| Ctrl+→ / ← | Next / Prev Page |
| Ctrl+Shift+N | Add Page |
| Escape | Deselect |
| ? | Show Shortcuts |

All shortcuts are **user-reassignable** in Settings → Keyboard Shortcuts.

### Onboarding
- Splash screen with Phoenix logo (auto-dismisses after 5 s)
- 6-step interactive tutorial with DOM-anchored tooltips

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop runtime | Electron 41 |
| UI | React 19 + TypeScript 6 |
| Build | Vite 8 (Rolldown) |
| State | Zustand 5 |
| Styling | Custom CSS only — CSS variables, BEM, 5 themes |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| PDF export | pdf-lib |
| Notifications | react-hot-toast |
| Storage | Local JSON files via IPC (AES-256-CBC encrypted) |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Development
```bash
npm install
npm run dev        # starts Vite + Electron
```

### Production Build
```bash
npm run build          # TypeScript + Vite build
npm run electron:build # packages Windows installer + portable exe
```

Output: `release/Formora-Setup-1.0.0.exe`

---

## Project Structure

```
src/
  components/
    builder/        # CanvasField, FieldPalette, FormCanvas, PropertiesPanel, PageManager, FormSettings
    explorer/       # FormCard
    layout/         # AppLayout, Sidebar, TitleBar, Toolbar
    ui/             # Modal, Button, Input, Select, Splash, Tutorial, KeyboardShortcuts
  hooks/            # useAutoSave, useSounds, useGlobalShortcuts
  pages/            # BuilderPage, ExplorerPage, SettingsPage, TemplatesPage
  services/
    pdf/            # pdfExport.ts
    shortcuts/      # shortcutsService.ts — user-assignable keybindings
    sound/          # SoundManager.ts — custom sounds + global toggle
  store/            # useFormStore, useUIStore
  styles/
    base/           # reset, typography
    components/     # button, input, modal, sidebar, toolbar, splash, tutorial, keyboard, etc.
    layout/         # app-layout
    pages/          # builder-page, explorer-page, templates
    themes/         # dark, light, crimson, forest, midnight
  types/
  utils/
electron/
  main.ts           # BrowserWindow, IPC handlers, app menu
  preload.ts        # contextBridge (window.electronAPI)
  ipc/              # form.ipc, file.ipc, export.ipc
```

---

## Architecture Notes

- All file I/O goes through IPC — React never touches the filesystem directly
- Forms stored as encrypted JSON (`AES-256-CBC`) in `%APPDATA%/formora/`
- Custom sounds stored as base64 data URLs in `localStorage` (< 2 MB each)
- User keybinding overrides stored in `localStorage` (`formora:keybindings`)
- Themes stored in `localStorage` (`formora:theme`)
- No cloud, no auth, no telemetry — fully local-first

---

## Developer

**Faizan Mir** — Grey Phoenix Studios  
mirfaizan8803@gmail.com

---

*Formora — Build beautiful forms. Export anywhere.*
