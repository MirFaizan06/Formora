import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowRight, Sparkles, Layers, FileText, Settings, Keyboard } from 'lucide-react'

interface TutorialProps {
  onDone: () => void
}

interface Step {
  id: number
  title: string
  body: string
  icon?: React.ReactNode
  anchor?: string     // data-tour attribute value on a DOM element to point at
  side?: 'right' | 'bottom' | 'left'
  finalAction?: string
}

const STEPS: Step[] = [
  {
    id: 0,
    title: 'Welcome to Formora!',
    body: "Let's take a 30-second tour. You'll learn how to build, fill, and export beautiful forms — all stored locally on your device.",
    icon: <Sparkles size={24} />,
  },
  {
    id: 1,
    title: 'Sidebar Navigation',
    body: 'Use the sidebar icons to switch between your form list (Explorer), the form builder, and settings. Collapse it any time for more canvas space.',
    anchor: 'sidebar',
    side: 'right',
    icon: <Layers size={20} />,
  },
  {
    id: 2,
    title: 'Field Palette',
    body: 'All your field types live here — Text, Date, Signature, Table, and more. Click any field to add it instantly, or drag it right onto the canvas.',
    anchor: 'palette',
    side: 'right',
    icon: <FileText size={20} />,
  },
  {
    id: 3,
    title: 'Form Canvas',
    body: "This is where your form comes to life. Drop fields here, click them to select, then tweak every detail in the right-side Properties Panel. Drag the grip handle to reorder.",
    anchor: 'canvas',
    side: 'left',
    icon: <Layers size={20} />,
  },
  {
    id: 4,
    title: 'Keyboard Shortcuts',
    body: 'Work faster with shortcuts: Ctrl+N creates a form, Ctrl+S saves, Ctrl+E exports to PDF, Delete removes a selected field. Press ? anytime to see the full list — all rebindable.',
    icon: <Keyboard size={20} />,
  },
  {
    id: 5,
    title: "You're all set!",
    body: 'Create your first form, fill it out in Preview mode (Ctrl+Shift+P), then export a clean PDF. Everything stays local — no account needed.',
    icon: <Sparkles size={24} />,
    finalAction: 'Start Building →',
  },
]

function StepDots({ current, total, onJump }: { current: number; total: number; onJump: (i: number) => void }) {
  return (
    <div className="tutorial-step-dots">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`tutorial-dot${i === current ? ' tutorial-dot--active' : ''}`}
          onClick={() => onJump(i)}
          aria-label={`Go to step ${i + 1}`}
        />
      ))}
    </div>
  )
}

interface AnchoredBox {
  left: number
  top: number
  side: 'right' | 'left' | 'bottom'
}

function useAnchor(anchor: string | undefined, side: Step['side'] = 'right'): AnchoredBox | null {
  const [box, setBox] = useState<AnchoredBox | null>(null)

  useEffect(() => {
    if (!anchor) { setBox(null); return }

    function compute() {
      const el = document.querySelector(`[data-tour="${anchor}"]`) as HTMLElement | null
      if (!el) { setBox(null); return }
      const rect = el.getBoundingClientRect()
      const GAP = 12
      if (side === 'right') {
        setBox({ left: rect.right + GAP, top: rect.top, side: 'right' })
      } else if (side === 'left') {
        setBox({ left: rect.left - GAP, top: rect.top, side: 'left' })
      } else {
        setBox({ left: rect.left, top: rect.bottom + GAP, side: 'bottom' })
      }
    }

    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [anchor, side])

  return box
}

function TooltipCard({
  step,
  box,
  onNext,
  onSkip,
  onJump,
  isFinal,
  total,
}: {
  step: Step
  box: AnchoredBox
  onNext: () => void
  onSkip: () => void
  onJump: (i: number) => void
  isFinal: boolean
  total: number
}) {
  const CARD_W = 300
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 10001,
    width: CARD_W,
  }

  if (box.side === 'right') {
    style.left = box.left
    style.top = box.top
  } else if (box.side === 'left') {
    style.left = box.left - CARD_W
    style.top = box.top
  } else {
    style.left = box.left
    style.top = box.top
  }

  // Keep within viewport
  if (typeof style.left === 'number') {
    style.left = Math.min(style.left, window.innerWidth - CARD_W - 16)
    style.left = Math.max(style.left, 16)
  }

  return (
    <motion.div
      className="tutorial-tooltip"
      style={style}
      initial={{ opacity: 0, scale: 0.9, x: box.side === 'right' ? -8 : 8 }}
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

export default function Tutorial({ onDone }: TutorialProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const box = useAnchor(current.anchor, current.side)
  const isFinal = step === STEPS.length - 1

  function finish() {
    localStorage.setItem('formora:tutorial-v2', '1')
    onDone()
  }

  function next() {
    if (isFinal) finish()
    else setStep((s) => s + 1)
  }

  const hasAnchor = !!current.anchor

  return (
    <AnimatePresence mode="wait">
      {/* Overlay — lighter when pointing at a real element */}
      <motion.div
        key={`overlay-${step}`}
        className={`tutorial-overlay${hasAnchor ? ' tutorial-overlay--light' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={hasAnchor ? undefined : undefined}
      />

      {hasAnchor && box ? (
        <TooltipCard
          key={`tip-${step}`}
          step={current}
          box={box}
          onNext={next}
          onSkip={finish}
          onJump={setStep}
          isFinal={isFinal}
          total={STEPS.length}
        />
      ) : (
        /* Centered modal */
        <motion.div
          key={`modal-${step}`}
          className="tutorial-modal-wrap"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
          style={{ position: 'fixed', zIndex: 10001, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        >
          <div className="tutorial-modal">
            <button className="tutorial-close btn btn-ghost btn-icon" onClick={finish} title="Skip tour">
              <X size={15} />
            </button>
            {current.icon && <div className="tutorial-modal__icon">{current.icon}</div>}
            <p className="tutorial-title">{current.title}</p>
            <p className="tutorial-body">{current.body}</p>
            <StepDots current={step} total={STEPS.length} onJump={setStep} />
            <div className="tutorial-actions">
              {!isFinal && (
                <button className="tutorial-btn tutorial-btn--ghost" onClick={finish}>
                  Skip Tour
                </button>
              )}
              <button className="tutorial-btn tutorial-btn--primary" onClick={next}>
                {isFinal ? (current.finalAction ?? 'Done') : 'Next'} <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
