import type { Progress } from './types'

const KEY = 'nazotoki-quest/progress/v1'

const empty: Progress = { points: 0, solvedCaseIds: [], dailyDates: [] }

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty
    const p = JSON.parse(raw)
    return {
      points: typeof p.points === 'number' ? p.points : 0,
      solvedCaseIds: Array.isArray(p.solvedCaseIds) ? p.solvedCaseIds : [],
      dailyDates: Array.isArray(p.dailyDates) ? p.dailyDates : [],
    }
  } catch {
    return empty
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    // プライベートモード等で保存できなくても遊べるようにする
  }
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 今日(または昨日)まで連続で解いた日数 */
export function calcStreak(dates: string[]): number {
  const set = new Set(dates)
  const d = new Date()
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1)
  let streak = 0
  while (set.has(todayKey(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export type Rank = { name: string; min: number }

export const RANKS: Rank[] = [
  { name: '見習い探偵', min: 0 },
  { name: '探偵助手', min: 100 },
  { name: '一人前探偵', min: 250 },
  { name: '名探偵', min: 500 },
]

export function rankOf(points: number): { current: Rank; next: Rank | null } {
  let current = RANKS[0]
  let next: Rank | null = null
  for (let i = 0; i < RANKS.length; i++) {
    if (points >= RANKS[i].min) {
      current = RANKS[i]
      next = RANKS[i + 1] ?? null
    }
  }
  return { current, next }
}
