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
4. **Redux Toolkit の設定とslice作成** - projects, currentProject, uiState
5. **Supabase の設定** - 認証、データベース、RLS
6. **基本レイアウトとルーティング設定** - Header, Footer, MainLayout
7. **トップページの実装** - キャッチコピー「組み立てながら学ぶ、ノーコードの新しいカタチ」
8. **ReactFlow編集画面の実装** - /projects/[id]、ComponentPalette、PropertyPanel、PreviewPanel
9. **UIパーツコンポーネントの作成** - Button、Text、Input + カスタムノード + ショーケースページ
10. **イベントハンドリングシステムの実装** - EventEngine、EventConfigModal、ノード統合

## 進行中タスク 🔄
なし

## 次のタスク 📋
- プレビュー機能の実装
- 料金プランページ (/pricing) の実装
- 認証・アカウント管理ページ (/account) の実装  
- プロジェクト一覧ページ (/projects) の実装
- Stripe決済APIの実装

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