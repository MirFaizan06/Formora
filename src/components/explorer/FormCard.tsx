import { motion } from 'framer-motion'
import { PenTool, Trash2, Copy, FileText } from 'lucide-react'
import type { Form } from '../../types/form.types'
import { useFormStore } from '../../store/useFormStore'
import { useUIStore } from '../../store/useUIStore'
import toast from 'react-hot-toast'

interface FormCardProps {
  form: Form
  onDeleteRequest: (id: string) => void
}

export default function FormCard({ form, onDeleteRequest }: FormCardProps) {
  const setActiveForm = useFormStore((s) => s.setActiveForm)
  const duplicateForm = useFormStore((s) => s.duplicateForm)
  const setView = useUIStore((s) => s.setView)

  function handleOpen() {
    setActiveForm(form.id)
    setView('builder')
  }

  function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation()
    duplicateForm(form.id)
    toast.success('Form duplicated')
  }

  const fieldCount = form.pages.reduce((acc, p) => acc + p.fields.length, 0)
  const updatedAt = new Date(form.updatedAt).toLocaleDateString()

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.12 }}
    >
      <div className="form-card" data-form-id={form.id} onClick={handleOpen}>
        <div className="form-card__icon">
          <FileText size={28} />
        </div>
        <div className="form-card__info">
          <h3 className="form-card__title">{form.title}</h3>
          <p className="form-card__meta">
            {form.pages.length} page{form.pages.length !== 1 ? 's' : ''} · {fieldCount} field{fieldCount !== 1 ? 's' : ''} · {updatedAt}
          </p>
          {form.description && <p className="form-card__desc">{form.description}</p>}
        </div>
        <div className="form-card__actions">
          <button className="btn btn-ghost btn-icon" onClick={handleOpen} title="Open in Builder">
            <PenTool size={15} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={handleDuplicate} title="Duplicate">
            <Copy size={15} />
          </button>
          <button
            className="btn btn-ghost btn-icon btn--danger-hover"
            onClick={(e) => { e.stopPropagation(); onDeleteRequest(form.id) }}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
