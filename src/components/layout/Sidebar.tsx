import { LayoutGrid, PenTool, Settings, Moon, Sun, ChevronLeft, Layers } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'
import type { AppView } from '../../types/form.types'

interface NavItem {
  id: AppView
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: 'explorer', label: 'Explorer', icon: <LayoutGrid size={18} /> },
  { id: 'builder', label: 'Builder', icon: <PenTool size={18} /> },
  { id: 'templates', label: 'Templates', icon: <Layers size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
]

export default function Sidebar() {
  const view = useUIStore((s) => s.view)
  const setView = useUIStore((s) => s.setView)
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  return (
    <aside className={`sidebar${sidebarCollapsed ? ' sidebar--collapsed' : ''}`} data-tour="sidebar">
      <div className="sidebar__logo">
        {!sidebarCollapsed && <span className="sidebar__logo-text">Formora</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item${view === item.id ? ' sidebar-item--active' : ''}`}
            onClick={() => setView(item.id)}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span className="sidebar-item__icon">{item.icon}</span>
            {!sidebarCollapsed && <span className="sidebar-item__label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar__bottom">
        <button className="sidebar-item" onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
          <span className="sidebar-item__icon">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </span>
          {!sidebarCollapsed && (
            <span className="sidebar-item__label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>

        <button className="sidebar-item sidebar-item--collapse" onClick={toggleSidebar} title="Toggle Sidebar">
          <span className="sidebar-item__icon">
            <ChevronLeft size={18} style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </span>
          {!sidebarCollapsed && <span className="sidebar-item__label">Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
