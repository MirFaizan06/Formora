import { AnimatePresence, motion } from 'framer-motion'
import TitleBar from './TitleBar'
import Sidebar from './Sidebar'
import Toolbar from './Toolbar'
import BuilderPage from '../../pages/BuilderPage'
import ExplorerPage from '../../pages/ExplorerPage'
import SettingsPage from '../../pages/SettingsPage'
import TemplatesPage from '../../pages/TemplatesPage'
import { useUIStore } from '../../store/useUIStore'
import { useMenuEvents } from '../../hooks/useMenuEvents'

export default function AppLayout() {
  const view = useUIStore((s) => s.view)
  useMenuEvents()

  return (
    <div className="app-layout">
      <TitleBar />
      <div className="app-body">
        <Sidebar />
        <div className="main-area">
          <Toolbar />
          <div className="canvas-area">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ height: '100%' }}
              >
                {view === 'explorer' && <ExplorerPage />}
                {view === 'builder' && <BuilderPage />}
                {view === 'settings' && <SettingsPage />}
                {view === 'templates' && <TemplatesPage />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
