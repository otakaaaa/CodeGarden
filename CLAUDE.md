# CodeGarden 開発進捗メモ

## プロジェクト概要
- **アプリ名**: CodeGarden
- **キャッチコピー**: 組み立てながら学ぶ、ノーコードの新しいカタチ
- **目的**: プログラミング学習用ノーコードアプリ（UIパーツをD&Dで配置、イベント設定でロジック学習）

## 技術スタック
- **フロント**: Next.js（App Router）+ TypeScript
- **状態管理**: Redux Toolkit
- **UI**: Tailwind CSS
- **画面構築**: react-flow
- **データ保存・認証**: Supabase（Postgres, Auth, Storage）
- **決済**: Stripe
- **デプロイ先**: Vercel

## 完了タスク ✅
1. **プロジェクト初期セットアップ** - Next.js + TypeScript + Tailwind CSS、必要パッケージインストール
2. **Docker環境構築** - ローカル開発用（Node.js 22 LTS、ポート3300）
3. **ディレクトリ構造修正** - 重複解消、ファイル配置最適化

## 進行中タスク 🔄
- **Redux Toolkit の設定とslice作成** (projects, currentProject, uiState)

## 次のタスク 📋
- Supabase の設定 (認証、データベース、RLS)
- 基本レイアウトとルーティング設定
- トップページ (/) の実装
- react-flow を使った編集画面 (/projects/[id]) の実装
- UIパーツコンポーネント (Button, Text, Input) の作成

## 重要な決定事項 📝
- Vercelデプロイ用にDocker本番環境設定は削除
- ローカル開発環境のみDockerを使用
- ダブルクォーテーション使用（シングルクォーテーション禁止）
- 毎回developブランチに戻ってpullしてからタスク実行

## 開発フロー
1. `git checkout develop && git pull`
2. `git checkout -b feature/task-name`
3. 実装
4. `git add . && git commit -m "タスク名"`
5. `git push -u origin feature/task-name`

## 環境情報
- **作業ディレクトリ**: `/Users/otaka/Documents/self/code-garden/`
- **ローカルポート**: 3300
- **Docker起動**: `make up` または `make dev`