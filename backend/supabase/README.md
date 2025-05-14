# レセプト理由書アシスタント Supabase移行ガイド

## 概要

このドキュメントでは、レセプト理由書アシスタントアプリケーションをFirebaseからSupabaseに移行するための手順と設定について説明します。

## 前提条件

- Supabaseアカウントとプロジェクトが作成済みであること
- PostgreSQLデータベースへのアクセス権があること
- Node.js および npm/pnpm がインストール済みであること

## 環境変数の設定

以下の環境変数を `.env` ファイルに設定してください：

```
# Supabase設定
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# データベース設定 (接続情報はSupabaseダッシュボードから取得できます)
DATABASE_URL=postgresql://postgres:password@your-project-id.supabase.co:5432/postgres
```

## 移行手順

### 1. Supabase CLIのインストールとセットアップ

```bash
npm install -g supabase
supabase login
```

### 2. データベーススキーマの移行

スキーマの移行はPrismaを使用して行います：

```bash
# Prismaマイグレーションファイルの生成（既存スキーマ→移行先スキーマ）
pnpm prisma migrate dev --name migrate_to_supabase

# マイグレーションの実行
pnpm prisma migrate deploy
```

### 3. ユーザーデータの移行

Firebaseから既存ユーザーをSupabaseに移行するには以下のスクリプトを実行します：

```bash
pnpm ts-node supabase/migrations/migrate-firebase-to-supabase.ts
```

**注意**: このスクリプトはユーザーのメールアドレスとプロファイル情報を移行しますが、セキュリティ上の理由からパスワードハッシュは移行できません。すべてのユーザーはパスワードリセットが必要です。

### 4. フロントエンドの更新

フロントエンドのFirebase SDKをSupabase SDKに置き換える必要があります。詳細は別途フロントエンドリポジトリのドキュメントを確認してください。

## Row Level Security (RLS) ポリシー

Supabaseではデフォルトですべてのテーブルへのアクセスが拒否されます。以下のポリシーをダッシュボードのSQLエディタから実行して、適切なアクセス制御を設定してください：

```sql
-- ユーザーは自分自身のデータのみ閲覧・編集可能
CREATE POLICY "ユーザーは自分のデータのみアクセス可能"
ON "public"."users"
FOR ALL
USING (auth.uid() = supabase_id);

-- 同様のポリシーを他のテーブルにも適用（例：patient_infos）
CREATE POLICY "ユーザーは自分の患者情報のみアクセス可能"
ON "public"."patient_infos"
FOR ALL
USING (auth.uid() IN (
  SELECT users.supabase_id FROM users WHERE users.id = user_id
));

-- 必要に応じて他のテーブルにも同様のポリシーを設定
```

## トラブルシューティング

- **認証エラー**: Supabaseの認証トークンが正しく設定されているか確認してください
- **データベース接続エラー**: DATABASE_URLが正しいか、ネットワーク設定が適切か確認してください
- **移行スクリプトエラー**: Firebase Admin SDKとSupabase SDKが正しくインストールされているか確認してください

## 参考リソース

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Prisma公式ドキュメント](https://www.prisma.io/docs)
- [Supabse Auth APIリファレンス](https://supabase.com/docs/reference/javascript/auth-api)