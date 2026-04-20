import { AnimatePresence, motion } from 'framer-motion'
import FieldPalette from '../components/builder/FieldPalette'
import FormCanvas from '../components/builder/FormCanvas'
import PropertiesPanel from '../components/builder/PropertiesPanel'
import FormRenderer from '../components/renderer/FormRenderer'
import { useUIStore } from '../store/useUIStore'
import { useFormStore } from '../store/useFormStore'

export default function BuilderPage() {
  const propertiesPanelOpen = useUIStore((s) => s.propertiesPanelOpen)
  const previewMode = useUIStore((s) => s.previewMode)
  const getActiveForm = useFormStore((s) => s.getActiveForm)
  const updateForm = useFormStore((s) => s.updateForm)

  const form = getActiveForm()

  return (
    <AnimatePresence mode="wait">
      {previewMode && form ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ height: '100%', overflow: 'auto' }}
        >
          <FormRenderer form={form} />
        </motion.div>
      ) : (
        <motion.div
          key="builder"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="builder-layout"
          style={{ height: '100%' }}
        >
          <FieldPalette />

          <div className="builder-main">
            {form && (
              <div className="builder-form-meta">
                <input
                  className="builder-form-title-input"
                  value={form.title}
                  onChange={(e) => updateForm(form.id, { title: e.target.value })}
                  placeholder="Form title..."
                />
                <input
                  className="builder-form-desc-input"
                  value={form.description ?? ''}
                  onChange={(e) => updateForm(form.id, { description: e.target.value })}
                  placeholder="Description (optional)..."
                />
              </div>
            )}
            <FormCanvas />
          </div>

          {propertiesPanelOpen && <PropertiesPanel />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
