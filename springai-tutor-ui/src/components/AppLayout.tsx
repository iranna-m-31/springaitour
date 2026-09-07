import { Outlet } from 'react-router-dom'
import FeatureNav from './FeatureNav'
import SearchPalette from './SearchPalette'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <FeatureNav />
      <main className="feature-content">
        <Outlet />
      </main>
      <SearchPalette />
    </div>
  )
}
