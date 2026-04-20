import { useState } from 'react'
import { FileText, Layers, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateId } from '../utils/generateId'
import type { Form, FormTemplate } from '../types/form.types'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates'
import { useFormStore } from '../store/useFormStore'
import { useUIStore } from '../store/useUIStore'
import Button from '../components/ui/Button'

const CATEGORY_STYLES: Record<string, { background: string; color: string }> = {
  business:   { background: 'var(--accent-subtle)',   color: 'var(--accent-color)' },
  hr:         { background: 'rgba(16,185,129,0.12)',  color: '#10B981' },
  healthcare: { background: 'rgba(14,165,233,0.12)',  color: '#0EA5E9' },
  education:  { background: 'rgba(245,158,11,0.12)',  color: '#F59E0B' },
  events:     { background: 'rgba(239,68,68,0.12)',   color: '#EF4444' },
  surveys:    { background: 'rgba(139,92,246,0.12)',  color: '#8B5CF6' },
  general:    { background: 'var(--bg-tertiary)',     color: 'var(--text-muted)' },
}

type CategoryKey = keyof typeof CATEGORY_STYLES | 'all'

const ALL_FILTERS: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All' },
  ...Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => ({
    key: key as CategoryKey,
    label,
  })),
]

function loadTemplate(
  template: FormTemplate,
  addForm: (form: Form) => void,
  setActiveForm: (id: string | null) => void,
  setView: (view: 'explorer' | 'builder' | 'settings' | 'templates') => void
) {
  const now = new Date().toISOString()
  const newForm: Form = {
    id: generateId(),
    title: template.name,
    description: template.description,
    createdAt: now,
    updatedAt: now,
    settings: { ...template.settings },
    pages: template.pages.map((p, pi) => ({
      id: generateId(),
      title: p.title,
      order: pi,
      fields: p.fields.map((f, fi) => ({
        ...f,
        id: generateId(),
        order: fi,
      })),
    })),
  }
  addForm(newForm)
  setActiveForm(newForm.id)
  setView('builder')
  toast.success(`"${template.name}" loaded! Start customizing.`)
}

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')

  const addForm = useFormStore((s) => s.addForm)
  const setActiveForm = useFormStore((s) => s.setActiveForm)
  const setView = useUIStore((s) => s.setView)

  const filtered =
    activeCategory === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory)

  return (
    <div className="templates-page">
      <div className="templates-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <Layers size={22} style={{ color: 'var(--accent-color)' }} />
          <h1 className="templates-title">Templates</h1>
        </div>
        <p className="templates-subtitle">Start with a pre-built form and customize it to fit your needs.</p>
      </div>

      {/* Category Filters */}
      <div className="templates-filters">
        {ALL_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`templates-filter-btn${activeCategory === f.key ? ' templates-filter-btn--active' : ''}`}
            onClick={() => setActiveCategory(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-16) 0' }}>
          <FileText size={40} style={{ margin: '0 auto var(--space-3)', opacity: 0.4 }} />
          <p>No templates in this category yet.</p>
        </div>
      ) : (
        <div className="templates-grid">
          {filtered.map((template) => {
            const catStyle = CATEGORY_STYLES[template.category] ?? CATEGORY_STYLES.general
            const catLabel = TEMPLATE_CATEGORIES[template.category] ?? template.category
            return (
              <div key={template.id} className="template-card">
                {/* Icon */}
                <div className="template-card__icon">
                  <FileText size={20} />
                </div>

                {/* Category Badge */}
                <div>
                  <span
                    className="template-card__category"
                    style={{ background: catStyle.background, color: catStyle.color }}
                  >
                    {catLabel}
                  </span>
                </div>

                {/* Name */}
                <div className="template-card__name">{template.name}</div>

                {/* Description */}
                <p className="template-card__desc">{template.description}</p>

                {/* Meta */}
                <p className="template-card__meta">
                  {template.fieldCount} fields &middot; {template.pages.length} page{template.pages.length !== 1 ? 's' : ''}
                </p>

                {/* Footer CTA */}
                <div className="template-card__footer">
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ width: '100%', justifyContent: 'center', gap: 'var(--space-2)' }}
                    onClick={() => loadTemplate(template, addForm, setActiveForm, setView)}
                  >
                    Use Template
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
