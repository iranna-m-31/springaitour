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
import IntroductionPage from './components/IntroductionPage'
import CompletionPage from './components/CompletionPage'
import CapstonePage from './components/CapstonePage'
import { lessons } from './data/lessons'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="introduction" element={<IntroductionPage />} />
          {/* Lesson-based routes - main curriculum */}
          {lessons.map((l) => (
            <Route
              key={l.id}
              path={`lesson/${l.id}`}
              element={<LessonPage lesson={l} />}
            />
          ))}
          {/* Feature-based routes - legacy compatibility */}
          {lessons.filter(l => l.featureId).map((l) => (
            <Route
              key={`feature-${l.featureId}`}
              path={`feature/${l.featureId}`}
              element={<FeaturePage feature={{ ...l, id: l.featureId, number: l.number, title: l.title, endpoint: '/api/tutor/chat' } as any} />}
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