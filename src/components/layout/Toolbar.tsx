import { useState } from 'react'
import { Plus, Save, FileDown, Printer, Eye, EyeOff, MonitorPlay, HelpCircle } from 'lucide-react'
import { useFormStore } from '../../store/useFormStore'
import { useUIStore } from '../../store/useUIStore'
import { useAutoSave } from '../../hooks/useAutoSave'
import { createEmptyForm } from '../../utils/formSchema'
import { generateFormPDF } from '../../services/pdf/pdfExport'
import KeyboardShortcuts from '../ui/KeyboardShortcuts'
import toast from 'react-hot-toast'

export default function Toolbar() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const view = useUIStore((s) => s.view)
  const setView = useUIStore((s) => s.setView)
  const propertiesPanelOpen = useUIStore((s) => s.propertiesPanelOpen)
  const togglePropertiesPanel = useUIStore((s) => s.togglePropertiesPanel)
  const previewMode = useUIStore((s) => s.previewMode)
  const togglePreviewMode = useUIStore((s) => s.togglePreviewMode)
  const addForm = useFormStore((s) => s.addForm)
  const setActiveForm = useFormStore((s) => s.setActiveForm)
  const getActiveForm = useFormStore((s) => s.getActiveForm)
  const forms = useFormStore((s) => s.forms)
  const activeFormId = useFormStore((s) => s.activeFormId)

  const { isSaving, lastSaved } = useAutoSave()

  async function handleSave() {
    if (!window.electronAPI) {
      toast.success('Form saved (demo mode)')
      return
    }
    const result = await window.electronAPI.saveForms(forms as unknown)
    if (result.success) toast.success('Forms saved')
    else toast.error('Failed to save')
  }

  async function handleExportPDF() {
    const form = getActiveForm()
    if (!form) { toast.error('No active form'); return }
    if (!window.electronAPI) { toast('PDF export requires Electron'); return }

    const path = await window.electronAPI.showSaveDialog({
      defaultPath: `${form.title}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    } as any)
    if (!path) return

    try {
      toast.loading('Generating PDF...')
      const bytes = await generateFormPDF(form)
      await window.electronAPI.exportPDF({ filePath: path, buffer: Array.from(bytes) })
      toast.dismiss()
      toast.success('PDF exported!')
    } catch {
      toast.dismiss()
      toast.error('Export failed')
    }
  }

  async function handlePrint() {
    if (!window.electronAPI) { toast('Print requires Electron'); return }
    await window.electronAPI.print({} as unknown)
  }

  function handleNewForm() {
    const form = createEmptyForm()
    addForm(form)
    setActiveForm(form.id)
    setView('builder')
  }

  function formatLastSaved(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={handleNewForm} title="New Form">
          <Plus size={16} />
          <span>New Form</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={handleSave} title="Save (Ctrl+S)">
          <Save size={16} />
          <span>Save</span>
        </button>

        <span className="toolbar-save-indicator">
          {isSaving
            ? 'Saving…'
            : lastSaved
            ? `Saved ✓ ${formatLastSaved(lastSaved)}`
            : ''}
        </span>

        {view === 'builder' && (
          <>
            <button className="toolbar-btn" onClick={handleExportPDF} title="Export PDF">
              <FileDown size={16} />
              <span>Export PDF</span>
            </button>
            <button className="toolbar-btn" onClick={handlePrint} title="Print">
              <Printer size={16} />
              <span>Print</span>
            </button>
          </>
        )}
      </div>

      {view === 'builder' && (
        <>
          <div className="toolbar-divider" />
          <div className="toolbar-group">
            <button
              className={`toolbar-btn${propertiesPanelOpen ? ' toolbar-btn--active' : ''}`}
              onClick={togglePropertiesPanel}
              title="Toggle Properties"
            >
              {propertiesPanelOpen ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>Properties</span>
            </button>

            {activeFormId && (
              <button
                className={`toolbar-btn${previewMode ? ' toolbar-btn--active' : ''}`}
                onClick={togglePreviewMode}
                title="Preview Form"
              >
                <MonitorPlay size={16} />
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => setShortcutsOpen(true)}
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </div>

    <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  )
}
