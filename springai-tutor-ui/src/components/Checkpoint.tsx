import { useState } from 'react'
import CodeBlock from './CodeBlock'

export type CheckpointType = 'multiple-choice' | 'predict-output' | 'fix-code' | 'fill-blank'

interface MultipleChoiceOption {
  label: string
  value: string
}

/**
 * Checkpoint component presenting a question/checkpoint to the learner.
 * Supports multiple question types.
 */
export default function Checkpoint({ type, question, options, answer, explanation }: {
  type: CheckpointType
  question: string
  options?: MultipleChoiceOption[]
  answer: string | string[]
  explanation: string
}) {
  const [showResult, setShowResult] = useState(false)
  const [selected, setSelected] = useState<string | string[] | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = (selectedValue: string | string[]) => {
    setSelected(selectedValue)
    const answerArr = Array.isArray(answer) ? answer : [answer]
    const selectedArr = Array.isArray(selectedValue) ? selectedValue : [selectedValue]
    const isCorrectResult = answerArr.every(a => selectedArr.includes(a)) && selectedArr.length === answerArr.length
    setIsCorrect(isCorrectResult)
    setShowResult(true)
  }

  if (type === 'multiple-choice' && options && options.length > 0) {
    return (
      <div className="checkpoint">
        <div className="checkpoint-question">
          <strong>{question}</strong>
        </div>
        <div className="checkpoint-options">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`checkpoint-option ${selected === opt.value ? 'selected' : ''}`}
              onClick={() => {
                setSelected(opt.value)
                handleSubmit(opt.value)
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'predict-output') {
    return (
      <div className="checkpoint">
        <div className="checkpoint-question">
          <strong>{question}</strong>
        </div>
        <textarea
          className="checkpoint-answer"
          rows={3}
          placeholder="Predict the output"
          onChange={(e) => setSelected(e.target.value)}
        ></textarea>
        <button
          type="button"
          className="btn btn-primary mt-2"
          onClick={() => handleSubmit(selected || '')}
          disabled={!selected}
        >
          Submit
        </button>
      </div>
    )
  }

  if (type === 'fix-code') {
    return (
      <div className="checkpoint">
        <div className="checkpoint-question">
          <strong>{question}</strong>
        </div>
        <div className="checkpoint-code">
          <CodeBlock language="java" value={selected as string || ''} showCopy={false} />
        </div>
        <button
          type="button"
          className="btn btn-primary mt-2"
          onClick={() => handleSubmit(selected as string | string[])}
          disabled={!selected}
        >
          Submit
        </button>
        {selected && (
          <p className={isCorrect ? 'text-green' : 'text-amber'}>
            {isCorrect ? 'Correct! ✅' : 'Not quite — review the code patterns.'}
          </p>
        )}
      </div>
    )
  }

  // fill-blank
  return (
    <div className="checkpoint">
      <div className="checkpoint-question">
        <strong>{question}</strong>
      </div>
      <input
        type="text"
        className="checkpoint-answer-input"
        placeholder="Fill in the blank"
        defaultValue=""
        onChange={(e) => setSelected(e.target.value)}
      />
      <button
        type="button"
        className="btn btn-primary mt-2"
        onClick={() => handleSubmit(selected || '')}
        disabled={!selected}
      >
        Submit
      </button>
      {showResult && (
        <p className={isCorrect ? 'text-green mt-2' : 'text-amber mt-2'}>
          {isCorrect ? 'Correct! ✅' : 'Not quite — ' + explanation}
        </p>
      )}
    </div>
  )
}