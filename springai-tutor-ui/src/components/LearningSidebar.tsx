import { Link, useLocation } from 'react-router-dom'
import { learningPhases, lessons } from '../data/lessons'
import { useProgress } from './HomePage'
import { useState } from 'react'

interface PhaseProgress {
  phaseId: string
  total: number
  completed: number
  percent: number
}

export default function LearningSidebar() {
  const location = useLocation()
  const { completed } = useProgress()
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(learningPhases.map(p => p.id)))

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev)
      if (next.has(phaseId)) next.delete(phaseId)
      else next.add(phaseId)
      return next
    })
  }

  // Compute progress per phase
  const phaseProgress: PhaseProgress[] = learningPhases.map(phase => {
    const phaseLessons = lessons.filter(l => l.phase === phase.id)
    const total = phaseLessons.length
    const completedCount = phaseLessons.filter(l => completed.has(l.id)).length
    return {
      phaseId: phase.id,
      total,
      completed: completedCount,
      percent: total > 0 ? Math.round((completedCount / total) * 100) : 0
    }
  })

  const totalCompleted = phaseProgress.reduce((sum, p) => sum + p.completed, 0)
  const totalLessons = phaseProgress.reduce((sum, p) => sum + p.total, 0)
  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0

  const currentPath = location.pathname

  return (
    <nav className="learning-sidebar" aria-label="Learning path">
      <div className="learning-sidebar-header">
        <h3>🧭 Learning Path</h3>
        <div className="learning-progress">
          <div className="progress-bar" style={{ height: '6px' }}>
            <div className="progress-fill" style={{ width: `${overallPercent}%` }} />
          </div>
          <span className="learning-progress-text">{totalCompleted} / {totalLessons} lessons</span>
        </div>
      </div>

      <div className="learning-sidebar-body">
        {learningPhases.map(phase => {
          const progress = phaseProgress.find(p => p.phaseId === phase.id)
          const isExpanded = expandedPhases.has(phase.id)
          const phaseLessons = lessons.filter(l => l.phase === phase.id)
          const isActive = phaseLessons.some(l => currentPath.includes(l.id))

          return (
            <div key={phase.id} className={`learning-phase ${isActive ? 'learning-phase--active' : ''}`}>
              <div
                className="learning-phase-header"
                onClick={() => togglePhase(phase.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <span className="phase-icon">{phase.icon}</span>
                <span className="phase-title">{phase.title}</span>
                {progress && (
                  <span className="phase-badge">
                    {progress.completed}/{progress.total}
                  </span>
                )}
                <span className={`phase-toggle ${isExpanded ? 'phase-toggle--expanded' : ''}`}>▸</span>
              </div>

              {isExpanded && (
                <ul className="learning-phase-lessons">
                  {phaseLessons.map(lesson => {
                    const isLessonActive = currentPath.includes(lesson.id)
                    const isCompleted = completed.has(lesson.id)
                    return (
                      <li
                        key={lesson.id}
                        className={`learning-lesson ${isLessonActive ? 'learning-lesson--active' : ''} ${isCompleted ? 'learning-lesson--completed' : ''}`}
                      >
                        <Link to={`/lesson/${lesson.id}`} className="learning-lesson-link">
                          <span className="lesson-number">{lesson.number}</span>
                          <span className="lesson-title">{lesson.title}</span>
                          {isCompleted && <span className="lesson-check">✓</span>}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {/* Completion CTA */}
      {totalCompleted > 0 && totalCompleted === totalLessons && (
        <div className="learning-sidebar-footer">
          <Link to="/completion" className="btn btn-primary btn-sm">
            🎓 Complete Course
          </Link>
        </div>
      )}
    </nav>
  )
}