import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LessonPage from './components/LessonPage'
import FeaturePage from './components/FeaturePage'
import DownloadSection from './components/DownloadSection'
import SettingsPage from './components/SettingsPage'
import CallLogPage from './components/CallLogPage'
import PlaygroundPage from './components/PlaygroundPage'
import LabPage from './components/LabPage'
import HomePage from './components/HomePage'
import CompletionPage from './components/CompletionPage'
import CapstonePage from './components/CapstonePage'
import { features } from './data/features'
import { lessons } from './data/lessons'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="introduction" element={<Navigate to="/" replace />} />
          {/* Lesson-based routes - main curriculum */}
          {lessons.map((l) => (
            <Route
              key={l.id}
              path={`lesson/${l.id}`}
              element={<LessonPage lesson={l} />}
            />
          ))}
          {/* Feature-based routes - backed by actual feature data */}
          {features.map((feature) => (
            <Route
              key={`feature-${feature.id}`}
              path={`feature/${feature.id}`}
              element={<FeaturePage feature={feature} />}
            />
          ))}
          <Route path="download" element={<DownloadSection />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="call-log" element={<CallLogPage />} />
          <Route path="playground" element={<PlaygroundPage />} />
          <Route path="lab" element={<LabPage />} />
          <Route path="capstone" element={<CapstonePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="completion" element={<CompletionPage />} />
      </Routes>
    </BrowserRouter>
  )
}