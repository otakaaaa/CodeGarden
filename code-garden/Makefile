.PHONY: up down build logs shell clean

# 開発環境起動
up:
	docker compose up -d

# 開発環境起動（ログ表示）
dev:
	docker compose up

# 停止
down:
	docker compose down

# ビルド
build:
	docker compose build

# ログ確認
logs:
	docker compose logs -f

# コンテナにシェルでアクセス
shell:
	docker compose exec app sh

# クリーンアップ
clean:
	docker compose down -v
	docker system prune -f