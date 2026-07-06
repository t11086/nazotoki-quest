import { useState } from 'react'
import type { CaseData, Quiz, StoryStep } from '../types'

const QUIZ_BASE = 30
const DEDUCTION_BASE = 40
const CLEAR_BONUS = 50

function QuizStep({ quiz, onSolved }: { quiz: Quiz; onSolved: (pts: number) => void }) {
  const [hintsUsed, setHintsUsed] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [solvedPts, setSolvedPts] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  const choose = (i: number) => {
    if (solvedPts !== null) return
    if (i === quiz.answerIndex) {
      const pts = Math.max(5, QUIZ_BASE - hintsUsed * 10 - wrong * 5)
      setSolvedPts(pts)
      setMessage('')
    } else {
      setWrong(w => w + 1)
      setMessage('うーん、ちがうようだ…。ヒントを見て、もう一度考えてみよう!')
    }
  }

  return (
    <div className="card">
      <span className={`badge badge-${quiz.category}`}>{quiz.category}の推理</span>
      <p className="intro">{quiz.intro}</p>
      <p className="question">Q. {quiz.question}</p>
      <div className="choices">
        {quiz.choices.map((c, i) => (
          <button
            key={i}
            className={
              'choice' +
              (solvedPts !== null && i === quiz.answerIndex ? ' correct' : '')
            }
            onClick={() => choose(i)}
            disabled={solvedPts !== null}
          >
            {c}
          </button>
        ))}
      </div>

      {message && solvedPts === null && <p className="miss">{message}</p>}

      {solvedPts === null && (
        <div className="hints">
          {quiz.hints.slice(0, hintsUsed).map((h, i) => (
            <p key={i} className="hint">
              💡 ヒント{i + 1}:{h}
            </p>
          ))}
          {hintsUsed < quiz.hints.length && (
            <button className="ghost" onClick={() => setHintsUsed(n => n + 1)}>
              ヒントを見る({hintsUsed + 1}/{quiz.hints.length})※獲得ポイント −10
            </button>
          )}
        </div>
      )}

      {solvedPts !== null && (
        <div className="reveal">
          <p className="correct-label">🎉 正解! +{solvedPts}pt</p>
          <p className="explain">{quiz.explain}</p>
          <button className="primary" onClick={() => onSolved(solvedPts)}>
            捜査を進める ▶
          </button>
        </div>
      )}
    </div>
  )
}

function DeductionStep({
  step,
  onSolved,
}: {
  step: Extract<StoryStep, { kind: 'deduction' }>
  onSolved: (pts: number) => void
}) {
  const [wrong, setWrong] = useState(0)
  const [wrongReason, setWrongReason] = useState('')
  const [solvedPts, setSolvedPts] = useState<number | null>(null)

  const choose = (id: string) => {
    if (solvedPts !== null) return
    if (id === step.culpritId) {
      setSolvedPts(Math.max(10, DEDUCTION_BASE - wrong * 10))
      setWrongReason('')
    } else {
      setWrong(w => w + 1)
      const s = step.suspects.find(s => s.id === id)
      setWrongReason(s?.innocentReason ?? '')
    }
  }

  return (
    <div className="card">
      <span className="badge badge-推理">最終推理</span>
      <p className="question">{step.question}</p>
      <div className="suspects">
        {step.suspects.map(s => (
          <button
            key={s.id}
            className={
              'suspect' +
              (solvedPts !== null && s.id === step.culpritId ? ' correct' : '')
            }
            onClick={() => choose(s.id)}
            disabled={solvedPts !== null}
          >
            <span className="suspect-emoji">{s.emoji}</span>
            <span className="suspect-name">{s.name}</span>
            <span className="suspect-desc">{s.desc}</span>
          </button>
        ))}
      </div>

      {wrongReason && solvedPts === null && <p className="miss">{wrongReason}</p>}

      {solvedPts !== null && (
        <div className="reveal">
          <p className="correct-label">🔍 見事な推理だ! +{solvedPts}pt</p>
          <p className="explain">{step.explain}</p>
          <button className="primary" onClick={() => onSolved(solvedPts)}>
            解決編へ ▶
          </button>
        </div>
      )}
    </div>
  )
}

export function CasePlay({
  data,
  alreadySolved,
  onFinish,
  onExit,
}: {
  data: CaseData
  alreadySolved: boolean
  onFinish: (earned: number) => void
  onExit: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [earned, setEarned] = useState(0)
  const [epilogueIndex, setEpilogueIndex] = useState(0)
  const [done, setDone] = useState(false)

  const inEpilogue = stepIndex >= data.steps.length
  const totalEarned = earned + CLEAR_BONUS

  const next = () => setStepIndex(i => i + 1)
  const addAndNext = (pts: number) => {
    setEarned(e => e + pts)
    next()
  }

  if (done) {
    return (
      <div className="screen">
        <div className="card center">
          <p className="big-emoji">🏆</p>
          <h2>事件解決!</h2>
          <p className="explain">
            FILE {data.no}『{data.title}』を解決した!
          </p>
          {alreadySolved ? (
            <p className="note">※この事件は解決ずみのため、ポイントは加算されません</p>
          ) : (
            <p className="correct-label">
              推理 +{earned}pt / 解決ボーナス +{CLEAR_BONUS}pt = 合計 +{totalEarned}pt
            </p>
          )}
          <button className="primary" onClick={() => onFinish(alreadySolved ? 0 : totalEarned)}>
            事務所にもどる
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <header className="case-header">
        <button className="ghost small" onClick={onExit}>
          ✕ 中断
        </button>
        <span className="case-title-small">
          FILE {data.no}:{data.title}
        </span>
        <span className="progress-count">
          {Math.min(stepIndex + 1, data.steps.length)}/{data.steps.length}
        </span>
      </header>

      {!inEpilogue &&
        (() => {
          const step = data.steps[stepIndex]
          switch (step.kind) {
            case 'narration':
              return (
                <div className="card">
                  {step.speaker && <p className="speaker">{step.speaker}</p>}
                  <p className="narration">{step.text}</p>
                  <button className="primary" onClick={next}>
                    つぎへ ▶
                  </button>
                </div>
              )
            case 'clue':
              return (
                <div className="card clue-card">
                  <p className="clue-title">
                    <span className="big-emoji-inline">{step.emoji}</span> {step.title}
                  </p>
                  <p className="narration">{step.text}</p>
                  <button className="primary" onClick={next}>
                    手がかりを記録した ▶
                  </button>
                </div>
              )
            case 'quiz':
              return <QuizStep key={step.quiz.id} quiz={step.quiz} onSolved={addAndNext} />
            case 'deduction':
              return <DeductionStep step={step} onSolved={addAndNext} />
          }
        })()}

      {inEpilogue && (
        <div className="card">
          <span className="badge badge-推理">解決編</span>
          <p className="narration">{data.epilogue[epilogueIndex]}</p>
          <button
            className="primary"
            onClick={() => {
              if (epilogueIndex + 1 < data.epilogue.length) {
                setEpilogueIndex(i => i + 1)
              } else {
                setDone(true)
              }
            }}
          >
            {epilogueIndex + 1 < data.epilogue.length ? 'つぎへ ▶' : '事件解決!'}
          </button>
        </div>
      )}
    </div>
  )
}
