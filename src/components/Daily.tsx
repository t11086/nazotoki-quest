import { useState } from 'react'
import { puzzleOfDay } from '../data/daily'
import { calcStreak, todayKey } from '../storage'
import type { Progress } from '../types'

const DAILY_PTS = 20

export function Daily({
  progress,
  onSolved,
  onExit,
}: {
  progress: Progress
  onSolved: () => void
  onExit: () => void
}) {
  const puzzle = puzzleOfDay()
  const solvedToday = progress.dailyDates.includes(todayKey())
  const [wrong, setWrong] = useState(false)
  const [justSolved, setJustSolved] = useState(false)
  const streak = calcStreak(progress.dailyDates)

  const choose = (i: number) => {
    if (solvedToday) return
    if (i === puzzle.answerIndex) {
      setJustSolved(true)
      onSolved()
    } else {
      setWrong(true)
    }
  }

  return (
    <div className="screen">
      <header className="case-header">
        <button className="ghost small" onClick={onExit}>
          ✕ もどる
        </button>
        <span className="case-title-small">🗓️ デイリー捜査</span>
        <span className="progress-count">🔥 {streak}日連続</span>
      </header>

      <div className="card">
        <span className={`badge badge-${puzzle.category}`}>{puzzle.category}</span>
        <p className="question">Q. {puzzle.question}</p>

        {solvedToday && !justSolved ? (
          <div className="reveal">
            <p className="correct-label">✅ 今日の捜査は完了ずみ!</p>
            <p className="explain">{puzzle.explain}</p>
            <p className="note">また明日、新しい謎で会おう。</p>
          </div>
        ) : (
          <>
            <div className="choices">
              {puzzle.choices.map((c, i) => (
                <button
                  key={i}
                  className={
                    'choice' + (justSolved && i === puzzle.answerIndex ? ' correct' : '')
                  }
                  onClick={() => choose(i)}
                  disabled={justSolved}
                >
                  {c}
                </button>
              ))}
            </div>
            {wrong && !justSolved && (
              <p className="miss">おしい!べつの答えを考えてみよう。</p>
            )}
            {justSolved && (
              <div className="reveal">
                <p className="correct-label">🎉 正解! +{DAILY_PTS}pt</p>
                <p className="explain">{puzzle.explain}</p>
                <button className="primary" onClick={onExit}>
                  事務所にもどる
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export const DAILY_POINTS = DAILY_PTS
