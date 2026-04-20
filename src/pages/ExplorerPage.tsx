import { useState } from 'react'
import { Search, Plus, FileText } from 'lucide-react'
import { useFormStore } from '../store/useFormStore'
import { useUIStore } from '../store/useUIStore'
import { createEmptyForm } from '../utils/formSchema'
import FormCard from '../components/explorer/FormCard'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function ExplorerPage() {
  const forms = useFormStore((s) => s.forms)
  const addForm = useFormStore((s) => s.addForm)
  const deleteForm = useFormStore((s) => s.deleteForm)
  const setActiveForm = useFormStore((s) => s.setActiveForm)
  const setView = useUIStore((s) => s.setView)
  const searchQuery = useUIStore((s) => s.searchQuery)
  const setSearchQuery = useUIStore((s) => s.setSearchQuery)

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = forms.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleNew() {
    const form = createEmptyForm()
    addForm(form)
    setActiveForm(form.id)
    setView('builder')
  }

  function handleDeleteConfirm() {
    if (!deleteId) return
    deleteForm(deleteId)
    toast.success('Form deleted')
    setDeleteId(null)
  }

  return (
    <div className="explorer-page">
      <div className="explorer-header">
        <h1 className="explorer-title">My Forms</h1>
        <div className="explorer-actions">
          <div className="search-box">
            <Search size={15} className="search-box__icon" />
            <input
              className="search-box__input"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="primary" onClick={handleNew}>
            <Plus size={16} />
            New Form
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="explorer-empty">
          <FileText size={56} className="explorer-empty__icon" />
          <p className="explorer-empty__title">
            {searchQuery ? 'No forms found' : 'No forms yet'}
          </p>
          <p className="explorer-empty__sub">
            {searchQuery ? 'Try a different search' : 'Create your first form to get started'}
          </p>
          {!searchQuery && (
            <Button variant="primary" onClick={handleNew}>Create Form</Button>
          )}
        </div>
      ) : (
        <div className="explorer-grid">
          {filtered.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onDeleteRequest={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!deleteId}
        title="Delete Form"
        onClose={() => setDeleteId(null)}
        isConfirmation
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to delete this form? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}
