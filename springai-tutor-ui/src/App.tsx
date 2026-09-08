import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import FeaturePage from './components/FeaturePage'
import DownloadSection from './components/DownloadSection'
import SettingsPage from './components/SettingsPage'
import CallLogPage from './components/CallLogPage'
import PlaygroundPage from './components/PlaygroundPage'
import HomePage from './components/HomePage'
import IntroductionPage from './components/IntroductionPage'
import CompletionPage from './components/CompletionPage'
import { features } from './data/features'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="introduction" element={<IntroductionPage />} />
          {features.map((f) => (
            <Route
              key={f.id}
              path={`feature/${f.id}`}
              element={<FeaturePage feature={f} />}
            />
          ))}
          <Route path="download" element={<DownloadSection />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="call-log" element={<CallLogPage />} />
          <Route path="playground" element={<PlaygroundPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="completion" element={<CompletionPage />} />
      </Routes>
    </BrowserRouter>
  )
}