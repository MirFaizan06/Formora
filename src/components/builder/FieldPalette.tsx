import { useState } from 'react'
import {
  Type, AlignLeft, Hash, Mail, Phone, Calendar, Clock,
  CheckSquare, List, Circle, ChevronDown, Star,
  MapPin, Edit3, PenLine, Table,
  Heading, Minus, Tag, Search,
} from 'lucide-react'
import type { FieldType } from '../../types/form.types'
import { createEmptyField } from '../../utils/formSchema'
import { useFormStore } from '../../store/useFormStore'

interface PaletteItem {
  type: FieldType
  label: string
  icon: React.ReactNode
  hint: string
}

interface PaletteSection {
  title: string
  items: PaletteItem[]
}

const PALETTE_SECTIONS: PaletteSection[] = [
  {
    title: 'Layout',
    items: [
      { type: 'form-header', label: 'Form Header',   icon: <Heading size={15} />,   hint: 'Big title + subtitle for the form top' },
      { type: 'divider',     label: 'Divider',        icon: <Minus size={15} />,     hint: 'Horizontal rule to separate sections' },
      { type: 'label',       label: 'Label / Text',   icon: <Tag size={15} />,       hint: 'Static descriptive text block' },
    ],
  },
  {
    title: 'Basic',
    items: [
      { type: 'text',     label: 'Text Input', icon: <Type size={15} />,      hint: 'Single-line text entry' },
      { type: 'textarea', label: 'Textarea',   icon: <AlignLeft size={15} />, hint: 'Multi-line text area' },
      { type: 'number',   label: 'Number',     icon: <Hash size={15} />,      hint: 'Numeric input with optional min/max' },
      { type: 'email',    label: 'Email',      icon: <Mail size={15} />,      hint: 'Email address input' },
      { type: 'phone',    label: 'Phone',      icon: <Phone size={15} />,     hint: 'Telephone number input' },
      { type: 'date',     label: 'Date',       icon: <Calendar size={15} />,  hint: 'Date picker' },
      { type: 'time',     label: 'Time',       icon: <Clock size={15} />,     hint: 'Time picker' },
    ],
  },
  {
    title: 'Selection',
    items: [
      { type: 'checkbox',       label: 'Checkbox',       icon: <CheckSquare size={15} />, hint: 'Single yes/no checkbox' },
      { type: 'checkbox-group', label: 'Checkbox Group', icon: <List size={15} />,        hint: 'Multiple selectable options' },
      { type: 'radio',          label: 'Radio Group',    icon: <Circle size={15} />,      hint: 'Pick one from a list' },
      { type: 'dropdown',       label: 'Dropdown',       icon: <ChevronDown size={15} />, hint: 'Select from a dropdown menu' },
      { type: 'rating',         label: 'Rating',         icon: <Star size={15} />,        hint: 'Star rating (1–10)' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { type: 'address',    label: 'Address',       icon: <MapPin size={15} />,  hint: 'Street, city, state, ZIP fields' },
      { type: 'fill-blank', label: 'Fill in Blank', icon: <Edit3 size={15} />,   hint: 'Sentence template with blank slots' },
      { type: 'signature',  label: 'Signature',     icon: <PenLine size={15} />, hint: 'Signature capture area' },
      { type: 'table',      label: 'Table',         icon: <Table size={15} />,   hint: 'Editable grid with custom columns' },
    ],
  },
]

export default function FieldPalette() {
  const getActiveForm = useFormStore((s) => s.getActiveForm)
  const getActivePage = useFormStore((s) => s.getActivePage)
  const addField = useFormStore((s) => s.addField)
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()

  function handleAdd(type: FieldType) {
    const form = getActiveForm()
    const page = getActivePage()
    if (!form || !page) return
    const field = createEmptyField(type)
    field.order = page.fields.length
    addField(form.id, page.id, field)
  }

  const filteredSections = query
    ? PALETTE_SECTIONS.map((s) => ({
        ...s,
        items: s.items.filter(
          (i) =>
            i.label.toLowerCase().includes(query) ||
            i.hint.toLowerCase().includes(query) ||
            i.type.toLowerCase().includes(query)
        ),
      })).filter((s) => s.items.length > 0)
    : PALETTE_SECTIONS

  return (
    <div className="field-palette" data-tour="palette">
      <div className="field-palette__header">Fields</div>

      <div className="field-palette__search">
        <Search size={12} className="field-palette__search-icon" />
        <input
          className="field-palette__search-input"
          placeholder="Search fields…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="field-palette__list">
        {filteredSections.length === 0 && (
          <div className="field-palette__empty">No fields match "{search}"</div>
        )}
        {filteredSections.map((section) => (
          <div key={section.title} className="palette-section">
            <div className="palette-section__title">{section.title}</div>
            {section.items.map((item) => (
              <button
                key={item.type}
                className="field-palette-item"
                onClick={() => handleAdd(item.type)}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('fieldType', item.type)}
                title={item.hint}
              >
                <span className="field-palette-item__icon">{item.icon}</span>
                <span className="field-palette-item__label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="field-palette__tip">
        Click or drag fields onto the canvas
      </div>
    </div>
  )
}
