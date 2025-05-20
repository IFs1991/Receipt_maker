# レセプト理由書アシスタント - バックエンド

レセプト理由書作成を支援するAIアシスタントのバックエンドAPIです。

## 技術スタック

- **言語・フレームワーク**: TypeScript + Express.js
- **データベース**: PostgreSQL (Supabase)
- **認証**: Supabase Auth
- **バリデーション**: Zod
- **ORM**: Prisma
- **コンテナ化**: Docker, Docker Compose

## Supabase移行について

このプロジェクトは元々Firebaseを使用していましたが、現在Supabaseへの移行を進めています。移行の主なポイントは以下の通りです：

- 認証: Firebase AuthからSupabase Authへ
- データベース: FirestoreからSupabase PostgreSQLへ
- ストレージ: Firebase StorageからSupabase Storageへ（必要に応じて）

### 移行状態

- [x] Supabaseクライアント設定
- [x] 認証ミドルウェアのSupabase Auth対応
- [ ] データベースマイグレーション
- [ ] ユーザー移行

## 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- Docker & Docker Compose
- pnpm (パッケージマネージャー)

### 環境変数

`.env` ファイルを作成し、以下の変数を設定してください：

```
# サーバー設定
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
API_BASE_PATH=/api/v1

# Supabase設定
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# データベース設定
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/receipt_assistant
```

### インストールと起動

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# または Docker Compose で起動
docker-compose up
```

## API エンドポイント

### 認証

- `POST /api/v1/auth/register` - ユーザー登録
- `POST /api/v1/auth/login` - ログイン

### チャット

- `POST /api/v1/chat/messages` - 新規メッセージ送信
- `GET /api/v1/chat/history` - チャット履歴取得

### 類似事例

- `GET /api/v1/similar-cases` - 類似事例検索
- `GET /api/v1/similar-cases/:id` - 特定の類似事例取得

### フィードバック

- `POST /api/v1/feedback` - フィードバック送信
- `GET /api/v1/feedback` - フィードバック取得
- `PUT /api/v1/feedback/:id` - フィードバック更新

## コード規約

このプロジェクトは、以下の規約に従っています：

- ESLint と Prettier を使用してコードスタイルを統一
- RESTful API デザイン原則に従う
- モジュール単位のディレクトリ構造
  - 各機能ごとに controller, service, routes, types, validator ファイルを作成

## テスト

```bash
# テストの実行
pnpm test

# テストカバレッジの確認
pnpm test:coverage
```

## コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

プロプライエタリ - 権利者の許可なく使用、複製、改変、配布を禁じます。

## 連絡先

質問や提案がある場合は、イシューを作成するか、プロジェクト管理者にお問い合わせください。