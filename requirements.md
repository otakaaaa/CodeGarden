# 🎯 プロジェクト概要
ノーコードでパーツを組み立てながら学べるプログラミング学習ツール「CodeGarden」を作成してください。

このアプリは以下を実現します：
- コードを書かずにUIパーツ（ボタン、テキスト、入力欄など）をドラッグ＆ドロップで配置
- 簡単なイベント（クリックでテキストを書き換える等）を設定し、自然にロジックを学べる
- JSON形式でアプリ構造を保存・復元可能
- 初学者や教育機関をターゲットとする

---

# 🚀 技術スタック
- フロント：Next.js（App Router）+ TypeScript
- 状態管理：Redux Toolkit
- UI：Tailwind CSS
- 画面構築：react-flow
- データ保存・認証：Supabase（Postgres, Auth, Storage）
- 決済：Stripe
- デプロイ先：Vercel

---

# ✅ 機能要件
## 🎯 MVP機能
- react-flowでUIパーツ（Button, Text, Input）をドラッグ＆ドロップで配置
- ノードにonClickなどのイベントを設定できる
- 入力欄とテキストをバインド可能
- プレビュー（テスト実行）でその場で動作を確認
- チュートリアル（例題）を最低1-2個提供

## 💰 課金機能
- Freeプランは1プロジェクトをローカル保存のみ
- Pro（¥980/月）は複数プロジェクト、クラウド保存、公開リンク、条件分岐・ループなど高度ロジック、PDF/コードエクスポートが可能
- Team（¥3,800/月）はProに加え、共同編集、メンバー管理、優先サポート
- Stripeで決済

---

# 📝 データモデル
## Supabase
- テーブル `projects`  
    - id: uuid（PK）
    - user_id: uuid（FK: auth.users.id）
    - name: text
    - data: jsonb （nodes, edges, settings構造）
    - created_at, updated_at: timestamp
    - is_deleted: boolean

- RLS: user_id = auth.uid() でのみアクセス可能

---

# ⚙️ Redux構成
- `projectsSlice`: プロジェクト一覧
- `currentProjectSlice`: 編集中のプロジェクト（nodes, edges, settings含む）
- `uiStateSlice`: UI状態（選択中ノード、ズーム、テーマ）

---

# 🚀 Supabase CRUD
- 一覧取得：`select id, name, updated_at`
- 詳細取得：`select * where id=`
- 作成：`insert`
- 更新：`update`
- 削除：`update is_deleted=true`

ReduxのcreateAsyncThunkで管理。

---

# 🌱 アプリ名・キャッチ
- アプリ名: `CodeGarden`
- キャッチコピー例: `組み立てながら学ぶ、ノーコードの新しいカタチ`

---

# ⚡ Vercel構成
- `vercel.json` は `"version": 2` のみ
- 環境変数はVercelのダッシュボードで設定

---

# ✅ Claudeへのお願い
この要件に基づいて、Next.js (App Router) プロジェクトをフルで生成してください。

- Redux store / slice 設計含む
- Supabase SDK のCRUD (createAsyncThunk)
- Stripe決済API (/app/api/checkout/route.ts)
- ページ構成：  
  - `/` トップページ（プラン説明）
  - `/projects` プロジェクト一覧
  - `/projects/[id]` 編集画面（react-flow組み込み）
  - `/pricing` 料金プラン
  - `/account` ログイン・管理

Tailwindでシンプル・柔らかいUIにし、キャッチコピーは「組み立てながら学ぶ、ノーコードの新しいカタチ」をトップに表示してください。

**実装コードをすべて出力してください。**

---

# 🚀 最後に
必要であれば質問しながら要件を詰めてください。
