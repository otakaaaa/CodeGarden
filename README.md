# CodeGarden

> 組み立てながら学ぶ、ノーコードの新しいカタチ

プログラミング学習用ノーコードアプリケーション

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router) + TypeScript
- **状態管理**: Redux Toolkit
- **UI**: Tailwind CSS
- **ビジュアル編集**: ReactFlow
- **認証・DB**: Supabase
- **決済**: Stripe
- **デプロイ**: Vercel

## 開発環境セットアップ

### 1. 依存関係インストール

```bash
npm install
```

### 2. 環境変数設定

`.env.docker or .env.local`ファイルを作成（以下参考）
```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=3で作成した情報を入力
NEXT_PUBLIC_SUPABASE_ANON_KEY=3で作成した情報を入力

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

```

### 3. Supabaseセットアップ

1. [Supabase](https://supabase.com)でプロジェクト作成
2. `supabase/migrations/001_create_projects_table.sql`を実行
3. 環境変数に接続情報を設定

### 4. Stripeセットアップ

1. [Stripe](https://stripe.com)でアカウント作成
2. ダッシュボードで商品・価格を作成
3. `src/lib/stripe/config.ts`の価格IDを更新
4. Webhookエンドポイントを設定（`/api/webhooks/stripe`）
5. 環境変数にキーを設定

### 5. 開発サーバー起動

#### ローカル（npm）
```bash
npm run dev
```

#### Docker
```bash
make build # 初回ビルド
make up    # バックグラウンド起動
make dev   # フォアグラウンド起動（ログ表示）
```

アプリケーションは http://localhost:3300 でアクセス可能

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
├── components/          # React コンポーネント
│   └── providers/       # Context Providers
├── lib/
│   ├── schemas.ts       # Zod スキーマ & 型定義
│   ├── store.ts         # Redux store
│   ├── hooks.ts         # Redux hooks
│   ├── supabase.ts      # Supabase client
│   ├── slices/          # Redux slices
│   └── supabase/        # Supabase API functions
└── ...
```

## 主な機能

### MVP機能
- UIパーツ（Button, Text, Input）のドラッグ&ドロップ配置
- ノードにイベント（onClick等）を設定
- プレビューモードでの動作確認
- プロジェクトの保存・読み込み

### 課金機能
- **Free**: 1プロジェクト、ローカル保存のみ
- **Pro** (¥980/月): 複数プロジェクト、クラウド保存、高度ロジック
- **Team** (¥3,800/月): 共同編集、メンバー管理

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# Lint
npm run lint

# Docker関連
make up      # 開発環境起動（バックグラウンド）
make dev     # 開発環境起動（ログ表示）
make down    # 停止
make logs    # ログ確認
make shell   # コンテナにアクセス
make clean   # クリーンアップ
```

## データベーススキーマ

### projects テーブル
```sql
- id: uuid (PK)
- user_id: uuid (FK: auth.users.id)
- name: text
- data: jsonb (nodes, edges, settings)
- created_at: timestamp
- updated_at: timestamp
- is_deleted: boolean
```

## ライセンス

MIT