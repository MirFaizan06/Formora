Here’s your **fully expanded, production-ready `CLAUDE.md`** tailored exactly to your constraints: small utility app, clean architecture, no overengineering, but still premium-quality and AI-optimized.

---

# CLAUDE.md

# Project: Dynamic Form Builder & Export Desktop App

---

## 🧠 PURPOSE OF THIS FILE

This file defines **strict rules, architecture, and behavior guidelines** for AI agents (Claude) working on this project.

### Core Principles

* Build a **small, powerful utility app** — NOT a bloated platform
* Focus on **excellent UX, performance, and reliability**
* Maintain **clean architecture from day one**
* Avoid unnecessary abstractions or overengineering
* Everything must feel **production-ready**, even in early stages

---

## 🚫 CLAUDE EXECUTION RULES (CRITICAL)

### DO:

* Work in **parallel using multiple agents** when possible:

  * UI Agent (components, styling)
  * Logic Agent (state, validation)
  * Electron Agent (IPC, filesystem)
  * PDF/Export Agent
* Make **decisive implementation choices** (don’t stall on options)
* Prefer **simple, robust solutions**
* Reuse components aggressively
* Keep code modular and readable

---

### DO NOT:

* ❌ Do NOT explain what you're doing step-by-step
* ❌ Do NOT output thinking text or internal reasoning
* ❌ Do NOT log commands or execution steps
* ❌ Do NOT over-engineer architecture
* ❌ Do NOT introduce unnecessary libraries

---

### OUTPUT RULE:

Only report when:

* A **major feature is completed**
* A **system is implemented**
* A **critical decision is made**

---

## 🧱 PROJECT VISION

Build a **premium desktop form builder** that:

* Feels like a **mini design tool (VSCode-style layout)**
* Allows users to create **fully customizable printable forms**
* Supports **multi-page forms**
* Has **pixel-level control over layout**
* Produces **clean PDF exports**

This is NOT just a form builder —
It is a **structured document designer optimized for printing**.

---

## 🛠 TECH STACK (FINALIZED)

### Core

* **Electron** (Desktop runtime)
* **React + TypeScript**
* **Vite**

---

### State Management (FINAL CHOICE)

✅ **Zustand**

Reason:

* Minimal boilerplate
* No reducer complexity
* Easier for AI to maintain reliably
* Less error-prone than Redux Toolkit for this scope

---

### Styling

* Custom CSS ONLY (no frameworks)
* CSS Variables (Design Tokens)

---

### UI Libraries

* Animations: **Framer Motion**
* Icons: **Lucide Icons**
* Notifications: **React Hot Toast**

---

### Storage

* Local JSON files (Node.js FS)
* Encryption for sensitive data

---

### PDF

* **pdf-lib** (preferred for structured control)

---

### Packaging

* Electron Builder (Windows `.exe`)

---

## 📁 PROJECT STRUCTURE

```
src/
  components/
  pages/
  layouts/
  builder/           ← form builder core logic
  renderer/          ← form rendering engine
  store/
  services/
    storage/
    encryption/
    pdf/
    ipc/
  utils/
  hooks/
  styles/
  assets/
```

---

## 🎨 UI / UX SYSTEM

### Layout Inspiration

* VSCode-style interface:

  * Sidebar (navigation + explorer)
  * Topbar (actions)
  * Main canvas (form builder)

---

### Layout Structure

* Left: Sidebar (Forms, Explorer, Settings)
* Top: Toolbar (Actions)
* Center: Canvas (Form Builder)
* Right (optional): Properties Panel

---

### UX Requirements

* Fully responsive (window resizing)
* No rigid layouts
* Clean spacing (8px grid system)
* Smooth transitions everywhere
* Proper empty states

---

### MUST INCLUDE

* Loading states (skeletons/spinners)
* Hover feedback
* Focus states
* Toast notifications
* Confirmation modals

---

## 🎨 CSS SYSTEM (STRICT)

### ❗ FORBIDDEN

* Tailwind
* Bootstrap
* Material UI
* Any CSS framework

---

### STRUCTURE (MANDATORY)

```
styles/
  base/
  components/
  layout/
  pages/
  themes/
  main.css
```

---

### RULES

* Use CSS variables ONLY for colors/spacing
* Use BEM or structured naming
* No deep nesting
* No inline styles (except dynamic values)

---

## 🌗 THEMING SYSTEM

### Required Themes

* Light Theme
* Dark Theme (Discord-style)

---

### Implementation Rules

* CSS variables based
* Runtime toggle
* Persist in local storage
* Smooth transitions

---

### Example Tokens

```
--bg-primary
--bg-secondary
--text-primary
--accent-color
--border-color
```

---

## 🧩 COMPONENT SYSTEM

Reusable components (strict):

* Button (primary, secondary, danger)
* Input
* Select
* Checkbox / Radio
* Card
* Modal
* Sidebar Item
* Toolbar Button

---

## 🧠 CORE FEATURE SYSTEM

---

### 1. FORM BUILDER (MAIN FEATURE)

This is the heart of the app.

#### Requirements:

* Drag-and-drop field system
* Reorder fields
* Resize fields (future-ready but simple first)
* Multi-page support
* Section/group support

---

### Field Types

* Text Input
* Textarea
* Number
* Date
* Checkbox
* Radio
* Dropdown
* Signature (basic)
* Static Text / Labels

---

### Builder Behavior

* Visual canvas editing
* Snap/grid alignment (light)
* Real-time preview

---

## 🧾 2. FORM RENDERING ENGINE

* Render schema → UI form
* Validation system
* Clean layout for filling

---

## 📂 3. EXPLORER SYSTEM

* List all forms
* Search forms
* Open / Delete / Duplicate

---

## 💾 4. STORAGE SYSTEM

### Rules:

* All data stored locally
* JSON-based structure

---

### Security (CRITICAL)

* Sensitive files must be encrypted
* Use Node crypto (AES)
* Never store raw credentials

---

## 📄 5. EXPORT SYSTEM

* Generate structured PDFs
* Maintain layout fidelity
* Multi-page support

---

## 🖨 6. PRINT SYSTEM

* Match preview layout exactly
* Use Electron print API

---

## 🔐 ELECTRON ARCHITECTURE

### Separation

* main (Node environment)
* preload (secure bridge)
* renderer (React)

---

### RULES

* ❌ No direct FS access in React
* ✅ All access via IPC
* ✅ Use preload for safe exposure

---

## 🔌 IPC DESIGN

Create structured IPC services:

```
ipc/
  form.ipc.ts
  file.ipc.ts
  export.ipc.ts
```

---

## 🔊 EXTRA ENHANCEMENTS

* UI sounds:

  * click
  * success
  * error

* Illustrations:

  * empty states
  * onboarding

---

## 📜 MENU SYSTEM

* New Form
* Open
* Save
* Save As
* Export PDF
* Print
* Settings
* About

---

## ℹ️ ABOUT SECTION

**Developer:** Faizan Mir
**Company:** Hachi wa Studios
**Email:** [mirfaizan8803@gmail.com](mailto:mirfaizan8803@gmail.com)

---

## 📦 BUILD SYSTEM

```
npm run build
npm run electron:build
```

---

## 🚀 DEVELOPMENT PRIORITIES

### Phase 1

* Layout
* Builder UI (basic fields)
* Save/load forms
* Explorer
* Form filling
* Validation
* PDF export
* Print system

### Phase 2

* Animations
* Theming polish
* UX refinement

---

## 🧠 ARCHITECTURAL RULES

* Keep logic separated from UI
* Prefer composition over inheritance
* Keep state minimal and local when possible

---

## 🧩 NON-GOALS (IMPORTANT)

* ❌ No cloud sync
* ❌ No authentication system
* ❌ No collaboration features
* ❌ No plugin system for now

---

## 🏁 FINAL EXPECTATION

The final app must feel like:

* A **mini VSCode for forms**
* Smooth, responsive, polished
* Minimal but powerful
* Reliable for real-world use

---

## ⚡ FINAL INSTRUCTION TO CLAUDE

Build this like a **premium utility product**, not a prototype.

* Prioritize UX over complexity
* Keep architecture clean
* Avoid unnecessary features
* Make everything feel intentional
