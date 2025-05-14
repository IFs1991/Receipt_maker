# レセプト理由書アシスタント バックエンド

このプロジェクトは、レセプト理由書作成支援フロントエンドアプリケーションのためのバックエンドシステムです。

## 目次
- [概要](#概要)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [環境変数](#環境変数)
- [APIドキュメント](#apiドキュメント)
- [データベースマイグレーション](#データベースマイグレーション)
- [テスト](#テスト)
- [Docker](#docker)
- [貢献](#貢献)
- [Supabase移行について](#supabase移行について)

## 概要
Firebase Authentication を利用したユーザー認証、PostgreSQLデータベースへのデータ永続化、AIアシスタント連携などの機能を提供します。

## 技術スタック
- Node.js (TypeScript)
- Express.js
- PostgreSQL
- Prisma (ORM)
- Firebase Admin SDK
- pnpm
- Docker

## セットアップ
1. リポジトリをクローン: `git clone ...`
2. 依存関係をインストール: `pnpm install`
3. 環境変数を設定: `.env.example` を参考に `.env` ファイルを作成
4. Firebase Admin SDK設定: `app/config/firebaseAdminSdkConfig.json` を配置 (詳細は環境変数セクション参照)
5. データベースマイグレーション: `pnpm prisma migrate dev`
6. 開発サーバー起動: `pnpm dev`

## 環境変数
必要な環境変数については `.env.example` を参照してください。
特に `DATABASE_URL` と Firebase Admin SDK の設定 (`FIREBASE_SERVICE_ACCOUNT_KEY_PATH` または `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64`) が重要です。

## APIドキュメント
APIエンドポイントの詳細は、Swagger/OpenAPIドキュメント (将来的に導入予定) またはソースコード (`app/modules/**/*.routes.ts`) を参照してください。

## データベースマイグレーション (Prisma)
- マイグレーション作成: `pnpm prisma migrate dev --name <migration_name>`
- マイグレーション適用 (開発): `pnpm prisma migrate dev`
- マイグレーション適用 (本番): `pnpm prisma migrate deploy`
- Prisma Studio起動: `pnpm prisma studio`

## テスト
- 全テスト実行: `pnpm test`
- カバレッジレポート生成: `pnpm test:cov`

## Docker
- Dockerイメージビルド: `docker build -t receipt-assistant-backend .`
- Docker Compose起動 (開発): `docker-compose up -d`
- Docker Compose停止: `docker-compose down`

## 貢献
貢献ガイドラインは `CONTRIBUTING.md` (作成予定) を参照してください。

## Supabase移行について

このプロジェクトはFirebaseからSupabaseへの移行を進めています。移行の詳細と手順については以下のドキュメントを参照してください：

- [Supabase移行計画](./spabase.yaml) - 詳細な移行計画と手順
- [Supabase移行ガイド](./supabase/README.md) - 開発者向け移行ガイド

移行作業の進捗状況や既知の問題については、プロジェクト管理ツールを確認してください。