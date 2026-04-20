import { useEffect, useState } from 'react'
import { Minus, Square, X, Maximize2 } from 'lucide-react'

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    window.electronAPI?.isMaximized().then(setIsMaximized)
    const unsub = window.electronAPI?.onWindowMaximized(setIsMaximized)
    return () => unsub?.()
  }, [])

  return (
    <div className="titlebar">
      <div className="titlebar__drag-region" />
      <span className="titlebar__title">Formora</span>
      <span className="titlebar__badge">by Grey Phoenix Studios</span>
      <div className="titlebar__drag-region" />
      <div className="titlebar__controls">
        <button
          className="titlebar__btn titlebar__btn--minimize"
          onClick={() => window.electronAPI?.minimize()}
          title="Minimize"
        >
          <Minus size={11} />
        </button>
        <button
          className="titlebar__btn titlebar__btn--maximize"
          onClick={() => window.electronAPI?.maximize()}
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          {isMaximized ? <Square size={10} /> : <Maximize2 size={10} />}
        </button>
        <button
          className="titlebar__btn titlebar__btn--close"
          onClick={() => window.electronAPI?.close()}
          title="Close"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
