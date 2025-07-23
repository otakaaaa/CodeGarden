# Cloudflare Pages デプロイ手順

## 1. 事前準備

### 必要な環境変数
以下の環境変数をCloudflare Pagesの設定で追加してください：

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=https://your-project.pages.dev
```

## 2. GitHub連携でのデプロイ（推奨）

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)にログイン
2. 「Workers & Pages」を選択
3. 「Create application」→「Pages」→「Connect to Git」
4. GitHubアカウントを連携し、`code-garden`リポジトリを選択
5. ビルド設定：
   - **Framework preset**: None
   - **Build command**: `npm run build:cf`
   - **Build output directory**: `out`
   - **Node version**: 22（環境変数で`NODE_VERSION=22`を設定）

## 3. 手動デプロイ（Wrangler CLI使用）

```bash
# Wranglerのインストール
npm install -g wrangler

# Cloudflareにログイン
wrangler login

# ビルド
npm run build:cf

# デプロイ
wrangler pages deploy out --project-name=code-garden
```

## 4. API Routes（Pages Functions）の設定

Next.jsのAPI Routesは自動的にCloudflare Pages Functionsとして動作します。
`/app/api`配下のルートは`/functions/api`として配置されます。

## 5. Stripe Webhookの設定

デプロイ後、Stripeダッシュボードで以下のWebhook URLを設定：
```
https://your-project.pages.dev/api/webhooks/stripe
```

## 6. カスタムドメインの設定（オプション）

1. Cloudflare Pagesの設定から「Custom domains」を選択
2. ドメインを追加（例：`codegarden.app`）
3. DNSレコードが自動的に追加される

## トラブルシューティング

### ビルドエラーが発生する場合
- Node.jsバージョンが22になっているか確認
- 環境変数がすべて設定されているか確認

### API Routesが動作しない場合
- Pages Functionsの互換性日付を確認（`wrangler.toml`）
- 環境変数が正しく設定されているか確認

### 静的ファイルが404になる場合
- `out/_next/static`ディレクトリが正しく生成されているか確認
- `public`フォルダの内容が`out`にコピーされているか確認