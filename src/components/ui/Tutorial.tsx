import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowRight, Sparkles, Layers, FileText, Keyboard } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'
import { useFormStore } from '../../store/useFormStore'
import { createEmptyForm } from '../../utils/formSchema'
import type { AppView } from '../../types/form.types'

interface TutorialProps {
  onDone: () => void
}

interface Step {
  id: number
  title: string
  body: string
  icon?: React.ReactNode
  /** data-tour value of element to anchor tooltip to */
  anchor?: string
  /** which side of the anchor to appear on */
  side?: 'right' | 'left' | 'bottom'
  /** navigate to this view before showing this step */
  requireView?: AppView
  finalAction?: string
}

const STEPS: Step[] = [
  {
    id: 0,
    title: 'Welcome to Formora!',
    body: "Let's take a quick tour — 6 steps. You'll learn to build, fill, and export beautiful forms stored locally on your device.",
    icon: <Sparkles size={24} />,
  },
  {
    id: 1,
    title: 'Sidebar Navigation',
    body: 'The sidebar lets you switch between Explorer (your forms list), Builder, Templates, and Settings. Click the arrow to collapse it and gain more canvas space.',
    anchor: 'sidebar',
    side: 'right',
    icon: <Layers size={20} />,
  },
  {
    id: 2,
    title: 'Field Palette',
    body: '18 field types across 4 categories — Text, Date, Signature, Table, and more. Search at the top, then click or drag onto the canvas to add a field instantly.',
    anchor: 'palette',
    side: 'right',
    requireView: 'builder',
    icon: <FileText size={20} />,
  },
  {
    id: 3,
    title: 'Form Canvas',
    body: 'Drop fields here to design your form. Click any field to select it, then adjust every detail in the Properties Panel on the right. Drag the grip handle to reorder.',
    anchor: 'canvas',
    side: 'left',
    requireView: 'builder',
    icon: <Layers size={20} />,
  },
  {
    id: 4,
    title: 'Keyboard Shortcuts',
    body: 'Ctrl+N creates a form, Ctrl+S saves, Ctrl+E exports to PDF, Delete removes a selected field, Ctrl+D duplicates. Press ? any time to see all shortcuts — all rebindable.',
    icon: <Keyboard size={20} />,
  },
  {
    id: 5,
    title: "You're all set!",
    body: 'Create your first form, fill it out in Preview mode (Ctrl+Shift+P), then export a clean PDF. Everything stays on your device — no account needed.',
    icon: <Sparkles size={24} />,
    finalAction: 'Start Building →',
    requireView: 'explorer',
  },
]

/* ── Dot nav ── */
function StepDots({ current, total, onJump }: { current: number; total: number; onJump: (i: number) => void }) {
  return (
    <div className="tutorial-step-dots">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`tutorial-dot${i === current ? ' tutorial-dot--active' : ''}`}
          onClick={() => onJump(i)}
          aria-label={`Step ${i + 1}`}
        />
      ))}
    </div>
  )
}

/* ── Resolve anchor rect with retry ── */
function resolveAnchor(
  anchor: string,
  side: 'right' | 'left' | 'bottom',
  onResolved: (pos: { left: number; top: number; side: typeof side }) => void,
  attempts = 0,
) {
  const el = document.querySelector(`[data-tour="${anchor}"]`) as HTMLElement | null
  if (el) {
    const rect = el.getBoundingClientRect()
    const GAP = 16
    if (side === 'right')  onResolved({ left: rect.right + GAP, top: rect.top, side })
    else if (side === 'left') onResolved({ left: rect.left - GAP, top: rect.top, side })
    else onResolved({ left: rect.left, top: rect.bottom + GAP, side })
  } else if (attempts < 15) {
    // Element not yet in DOM — retry (max ~750 ms)
    setTimeout(() => resolveAnchor(anchor, side, onResolved, attempts + 1), 50)
  }
  // If still not found after retries, leave pos null → falls back to centered modal
}

/* ── Tooltip card (fixed-positioned) ── */
function TooltipCard({
  step, pos, onNext, onSkip, onJump, isFinal, total,
}: {
  step: Step
  pos: { left: number; top: number; side: 'right' | 'left' | 'bottom' }
  onNext: () => void
  onSkip: () => void
  onJump: (i: number) => void
  isFinal: boolean
  total: number
}) {
  const CARD_W = 308
  let left = pos.left
  let top = pos.top

  if (pos.side === 'left') left = pos.left - CARD_W
  // Clamp inside viewport
  left = Math.max(12, Math.min(left, window.innerWidth - CARD_W - 12))
  top  = Math.max(12, Math.min(top,  window.innerHeight - 300))

  return (
    <motion.div
      className="tutorial-tooltip"
      style={{ position: 'fixed', zIndex: 10001, width: CARD_W, left, top }}
      initial={{ opacity: 0, scale: 0.9, x: pos.side === 'right' ? -10 : 10 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {step.icon && <div className="tutorial-tooltip__icon">{step.icon}</div>}
      <p className="tutorial-title">{step.title}</p>
      <p className="tutorial-body">{step.body}</p>
      <StepDots current={step.id} total={total} onJump={onJump} />
      <div className="tutorial-actions">
        <button className="tutorial-btn tutorial-btn--ghost" onClick={onSkip}>Skip</button>
        <button className="tutorial-btn tutorial-btn--primary" onClick={onNext}>
          {isFinal ? (step.finalAction ?? 'Done') : 'Next'} <ArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  )
}

/* ── Centered modal card ── */
function ModalCard({
  step, onNext, onSkip, onJump, isFinal, total,
}: {
  step: Step
  onNext: () => void
  onSkip: () => void
  onJump: (i: number) => void
  isFinal: boolean
  total: number
}) {
  return (
    <motion.div
      key={`modal-${step.id}`}
      style={{ position: 'fixed', zIndex: 10001, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      initial={{ opacity: 0, scale: 0.92, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
    >
      <div className="tutorial-modal">
        {!isFinal && (
          <button className="tutorial-close btn btn-ghost btn-icon" onClick={onSkip} title="Skip tour">
            <X size={15} />
          </button>
        )}
        {step.icon && <div className="tutorial-modal__icon">{step.icon}</div>}
        <p className="tutorial-title">{step.title}</p>
        <p className="tutorial-body">{step.body}</p>
        <StepDots current={step.id} total={total} onJump={onJump} />
        <div className="tutorial-actions">
          {!isFinal && (
            <button className="tutorial-btn tutorial-btn--ghost" onClick={onSkip}>Skip Tour</button>
          )}
          <button className="tutorial-btn tutorial-btn--primary" onClick={onNext}>
            {isFinal ? (step.finalAction ?? 'Done') : 'Next'} <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main Tutorial component ── */
export default function Tutorial({ onDone }: TutorialProps) {
  const [stepIdx, setStepIdx] = useState(0)
  const [anchorPos, setAnchorPos] = useState<{ left: number; top: number; side: 'right' | 'left' | 'bottom' } | null>(null)
  const setView = useUIStore((s) => s.setView)
  const addForm = useFormStore((s) => s.addForm)
  const setActiveForm = useFormStore((s) => s.setActiveForm)
  const forms = useFormStore((s) => s.forms)

  const current = STEPS[stepIdx]
  const isFinal = stepIdx === STEPS.length - 1

  /* Ensure a form exists whenever we navigate to builder */
  function ensureForm() {
    if (forms.length === 0) {
      const f = createEmptyForm()
      addForm(f)
      setActiveForm(f.id)
    } else {
      setActiveForm(forms[0].id)
    }
  }

  /* When step changes: navigate if needed, then resolve anchor */
  useEffect(() => {
    setAnchorPos(null) // clear previous anchor immediately

    if (current.requireView) {
      if (current.requireView === 'builder') ensureForm()
      setView(current.requireView)
    }

    if (current.anchor) {
      // Delay first attempt to give React time to re-render after setView
      const t = setTimeout(() => {
        resolveAnchor(
          current.anchor!,
          current.side ?? 'right',
          (pos) => setAnchorPos(pos),
        )
      }, 180)
      return () => clearTimeout(t)
    }
  }, [stepIdx])

  function finish() {
    localStorage.setItem('formora:tutorial-v2', '1')
    onDone()
  }

  function next() {
    if (isFinal) finish()
    else setStepIdx((s) => s + 1)
  }

  function jumpTo(i: number) {
    setStepIdx(i)
  }

  const isAnchored = !!current.anchor
  const showTooltip = isAnchored && anchorPos !== null
  const showModal   = !isAnchored || (isAnchored && anchorPos === null)

  return (
    <AnimatePresence mode="sync">
      {/* Backdrop */}
      <motion.div
        key={`backdrop-${stepIdx}`}
        className={`tutorial-overlay${isAnchored ? ' tutorial-overlay--light' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {showTooltip ? (
        <TooltipCard
          key={`tip-${stepIdx}`}
          step={current}
          pos={anchorPos!}
          onNext={next}
          onSkip={finish}
          onJump={jumpTo}
          isFinal={isFinal}
          total={STEPS.length}
        />
      ) : showModal ? (
        <ModalCard
          key={`modal-${stepIdx}`}
          step={current}
          onNext={next}
          onSkip={finish}
          onJump={jumpTo}
          isFinal={isFinal}
          total={STEPS.length}
        />
      ) : null}
    </AnimatePresence>
  )
}
