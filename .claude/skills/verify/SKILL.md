---
name: verify
description: nazotoki-quest の動作検証手順(ビルド → preview → Playwright でプレイフローを駆動)
---

# nazotoki-quest verify

## Build & serve

```bash
npm install
npm run build                       # tsc --noEmit && vite build
npm run preview -- --port 4173 --strictPort   # dist/ を配信(バックグラウンドで)
```

## Drive(surface = モバイルブラウザ)

Playwright(chromium + `devices['iPhone 13']`)で http://localhost:4173/ を開いて操作する。
scratchpad に `npm install playwright && npx playwright install chromium` で用意できる。

検証すべきフロー:

1. ホーム初期状態:「見習い探偵 / 0 pt」表示
2. 事件簿 FILE 1 を最後まで(ナレーション → 手がかり3件 → クイズ3問 → 最終推理 → 解決編3ページ)
   - クイズは誤答(-5pt)とヒント(-10pt)のポイント減算も確認する
   - 全クリアで「推理 +Npt / 解決ボーナス +50pt」の合計表示 → ホームでランクアップ
3. デイリー捜査:正解 +20pt、ホームで「🔥 N日連続」、再訪で「完了ずみ」表示
4. `page.reload()` で localStorage 永続化を確認
5. 事件を再プレイで開けること、「✕ 中断」でホームに戻れること

## Gotchas

- ボタンは `getByRole('button', { name: ... })` で拾える。選択肢は `.choice`、容疑者は `.suspect`
- デイリーの正解は日付でローテーションする(`src/data/daily.ts` の `puzzleOfDay`)ので、
  正解を決め打ちせず選択肢を順に試す
- 進行データは localStorage キー `nazotoki-quest/progress/v1`
