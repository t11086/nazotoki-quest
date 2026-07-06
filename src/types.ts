export type Category = '国語' | '数学' | '英語' | '理科' | '社会' | '推理'

export type Quiz = {
  id: string
  category: Category
  intro: string
  question: string
  choices: string[]
  answerIndex: number
  hints: string[]
  explain: string
}

export type Suspect = {
  id: string
  name: string
  emoji: string
  desc: string
  innocentReason: string
}

export type StoryStep =
  | { kind: 'narration'; speaker?: string; text: string }
  | { kind: 'clue'; emoji: string; title: string; text: string }
  | { kind: 'quiz'; quiz: Quiz }
  | {
      kind: 'deduction'
      question: string
      suspects: Suspect[]
      culpritId: string
      explain: string
    }

export type CaseData = {
  id: string
  no: number
  title: string
  subtitle: string
  minutes: string
  steps: StoryStep[]
  epilogue: string[]
}

export type DailyPuzzle = {
  category: Category
  question: string
  choices: string[]
  answerIndex: number
  explain: string
}

export type Progress = {
  points: number
  solvedCaseIds: string[]
  dailyDates: string[]
}
