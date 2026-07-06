import { useState } from 'react'
import { CasePlay } from './components/CasePlay'
import { Daily, DAILY_POINTS } from './components/Daily'
import { case1 } from './data/case1'
import { calcStreak, loadProgress, rankOf, saveProgress, todayKey } from './storage'
import type { Progress } from './types'

type Screen = 'home' | 'case' | 'daily'

export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [screen, setScreen] = useState<Screen>('home')

  const update = (p: Progress) => {
    setProgress(p)
    saveProgress(p)
  }

  if (screen === 'case') {
    return (
      <CasePlay
        data={case1}
        alreadySolved={progress.solvedCaseIds.includes(case1.id)}
        onExit={() => setScreen('home')}
        onFinish={earned => {
          update({
            ...progress,
            points: progress.points + earned,
            solvedCaseIds: progress.solvedCaseIds.includes(case1.id)
              ? progress.solvedCaseIds
              : [...progress.solvedCaseIds, case1.id],
          })
          setScreen('home')
        }}
      />
    )
  }

  if (screen === 'daily') {
    return (
      <Daily
        progress={progress}
        onExit={() => setScreen('home')}
        onSolved={() =>
          update({
            ...progress,
            points: progress.points + DAILY_POINTS,
            dailyDates: [...progress.dailyDates, todayKey()],
          })
        }
      />
    )
  }

  const { current, next } = rankOf(progress.points)
  const pct = next
    ? Math.min(100, Math.round(((progress.points - current.min) / (next.min - current.min)) * 100))
    : 100
  const caseSolved = progress.solvedCaseIds.includes(case1.id)
  const dailyDone = progress.dailyDates.includes(todayKey())
  const streak = calcStreak(progress.dailyDates)

  return (
    <div className="screen">
      <header className="home-header">
        <h1>🔍 ナゾトキクエスト</h1>
        <p className="tagline">知識で解く事件簿</p>
      </header>

      <div className="card rank-card">
        <div className="rank-row">
          <span className="rank-name">{current.name}</span>
          <span className="rank-points">{progress.points} pt</span>
        </div>
        <div className="bar">
          <div className="bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="note">
          {next ? `次のランク「${next.name}」まで あと ${next.min - progress.points}pt` : '最高ランク到達!'}
        </p>
      </div>

      <button className="menu-card" onClick={() => setScreen('case')}>
        <span className="menu-emoji">🗂️</span>
        <span className="menu-body">
          <span className="menu-title">
            事件簿 FILE 1{caseSolved && ' ✅'}
          </span>
          <span className="menu-desc">
            『{case1.title}』({case1.minutes})
            {caseSolved && ' — 解決ずみ・もう一度遊べる'}
          </span>
        </span>
        <span className="menu-arrow">▶</span>
      </button>

      <button className="menu-card" onClick={() => setScreen('daily')}>
        <span className="menu-emoji">🗓️</span>
        <span className="menu-body">
          <span className="menu-title">デイリー捜査{dailyDone && ' ✅'}</span>
          <span className="menu-desc">
            1日1問の小さな謎 — 🔥 {streak}日連続捜査中
          </span>
        </span>
        <span className="menu-arrow">▶</span>
      </button>

      <footer className="foot-note">
        <p>進行データはこの端末に保存されます(小6〜中3向け・プロトタイプ版)</p>
      </footer>
    </div>
  )
}
