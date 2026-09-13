import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import TopNav from './TopNav'
import LearningSidebar from './LearningSidebar'
import SearchPalette from './SearchPalette'
import Footer from './Footer'

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={`app-layout${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <TopNav />
      <div className="sidebar-container">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
          title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
        >
          {sidebarCollapsed ? '▶' : '◀'}
        </button>
        <LearningSidebar />
      </div>
      <main className="lesson-content">
        <Outlet />
      </main>
      <SearchPalette />
      <Footer />
    </div>
  )
}
