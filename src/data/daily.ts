import type { DailyPuzzle } from '../types'

export const dailyPool: DailyPuzzle[] = [
  {
    category: '推理',
    question:
      'ある探偵は、月曜日と金曜日だけウソをつく。その探偵が「今日は金曜日だ」と言った。今日は何曜日?',
    choices: ['月曜日', '水曜日', '金曜日'],
    answerIndex: 0,
    explain:
      'もし本当に金曜日なら、金曜はウソをつく日なので「今日は金曜日だ」という本当のことは言えない。つまりこの発言はウソ。ウソをつくのは月曜か金曜で、金曜ではないから――今日は月曜日!',
  },
  {
    category: '数学',
    question: '連続する3つの整数をたすと48になった。まん中の数はいくつ?',
    choices: ['15', '16', '17'],
    answerIndex: 1,
    explain:
      '連続する3つの整数の和は「まん中の数×3」。48 ÷ 3 = 16 がまん中の数。(15+16+17=48)',
  },
  {
    category: '英語',
    question: '暗号メモに「Wednesday に決行する」とあった。決行日は何曜日?',
    choices: ['火曜日', '水曜日', '木曜日'],
    answerIndex: 1,
    explain: 'Wednesday は水曜日。Tuesday(火)、Thursday(木)とまちがえやすいので注意!',
  },
  {
    category: '理科',
    question:
      'コップの水に氷がうかんでいる。氷が全部とけると、水面の高さはどうなる?',
    choices: ['上がる', '下がる', 'ほぼ変わらない'],
    answerIndex: 2,
    explain:
      '氷は水面の上に出ている分だけ体積が大きいが、とけると「氷が押しのけていた水の体積」とちょうど同じになる。だから水面はほぼ変わらない。',
  },
  {
    category: '社会',
    question: '逃走した犯人は「日本でいちばん面積の大きい都道府県」に向かった。どこ?',
    choices: ['岩手県', '北海道', '長野県'],
    answerIndex: 1,
    explain:
      '北海道は約8.3万km²で断トツの1位。2位の岩手県(約1.5万km²)の5倍以上の広さがある。',
  },
  {
    category: '国語',
    question:
      '「上から読んでも下から読んでも同じ」文はどれ?(回文をさがせ!)',
    choices: ['たけやぶやけた', 'ねこがねている', 'みかんをたべた'],
    answerIndex: 0,
    explain: '「たけやぶやけた」は逆から読んでも「たけやぶやけた」。これが回文!',
  },
  {
    category: '数学',
    question:
      '暗号錠のヒント:「2, 3, 5, 7, 11, □」。□に入る数は?',
    choices: ['12', '13', '15'],
    answerIndex: 1,
    explain:
      'これは素数(1とその数自身でしか割り切れない数)の列。11の次の素数は13。',
  },
]

/** 日付から今日の1問を決める(毎日ちがう問題になる) */
export function puzzleOfDay(d = new Date()): DailyPuzzle {
  const days = Math.floor(d.getTime() / 86400000)
  return dailyPool[days % dailyPool.length]
}
