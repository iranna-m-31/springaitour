import { Link } from 'react-router-dom'
import { getLesson } from '../data/lessons'
import { useProgress } from './HomePage'

interface PrerequisitePanelProps {
  lessonId: string
  prerequisites: Array<{ lessonId: string; description: string }>
}

/**
 * Prerequisite awareness panel shown before starting a lesson.
 * Warns users if they haven't completed the required prerequisites.
 */
export default function PrerequisitePanel({ lessonId, prerequisites }: PrerequisitePanelProps) {
  const lesson = getLesson(lessonId)
  const { completed } = useProgress()

  const incomplete = prerequisites.filter(p => !completed.has(p.lessonId))

  if (incomplete.length === 0) return null

  return (
    <div className="prerequisite-panel">
      <h3>⚠️ Before starting {lesson?.title || 'this lesson'}</h3>
      <p>You should understand the following concepts first:</p>
      <ul>
        {incomplete.map(prereq => {
          const prereqLesson = getLesson(prereq.lessonId)
          return (
            <li key={prereq.lessonId}>
              <Link to={`/lesson/${prereq.lessonId}`} className="prerequisite-link">
                <span className="prerequisite-link-label">
                  {prereqLesson?.title || prereq.lessonId}
                </span>
                <span className="prerequisite-link-desc">{prereq.description}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="prerequisite-actions">
        <Link to={`/lesson/${incomplete[0].lessonId}`} className="btn btn-sm btn-primary">
          📖 Review Prerequisite
        </Link>
        <button className="btn btn-sm btn-secondary" onClick={() => window.open('/lesson/' + lessonId)}>
          Skip Anyway →
        </button>
      </div>
    </div>
  )
}