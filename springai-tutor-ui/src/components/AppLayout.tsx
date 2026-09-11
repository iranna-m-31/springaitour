import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'
import LearningSidebar from './LearningSidebar'
import LocalLabPanel from './LocalLabPanel'
import SearchPalette from './SearchPalette'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <TopNav />
      <LearningSidebar />
      <main className="lesson-content">
        <Outlet />
      </main>
      <aside className="lab-panel" aria-label="Local lab">
        <LocalLabPanel />
      </aside>
      <SearchPalette />
    </div>
  )
}
