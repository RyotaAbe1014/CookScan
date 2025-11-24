# CLAUDE.md

このファイルは、CookScanリポジトリでコードを扱う際のClaude Code (claude.ai/code)および他のAIアシスタントへのガイダンスを提供します。

## プロジェクト概要

CookScanは、AIを使用して画像（スクリーンショット、写真、手書きメモ）からレシピ情報を抽出し、構造化されたJSONデータに変換するレシピ抽出・管理Webアプリケーションです。OCRとLLM技術を使用してレシピデータを解析・構造化します。

**主な機能:**
- AI搭載の画像からのレシピ抽出
- クリップボードからの画像貼り付け対応
- ユーザー認証とプロフィール管理
- レシピのバージョン管理と履歴追跡
- タグの作成・編集・削除機能
- カテゴリ付きタグベースの整理
- レシピ作成時のタグ紐付け
- レシピのソース帰属
- OCR処理履歴

## リポジトリ構造

このプロジェクトは2つのメインアプリケーションを含む**モノレポ**です:

```
CookScan/
├── cook-scan/          # メインのNext.js本番アプリケーション
├── sample/             # サンプル/プロトタイプアプリケーション
│   ├── backend/        # Hono + Mastra バックエンド
│   ├── frontend/       # React + Vite フロントエンド
│   └── docs/           # ドキュメント
├── terraform/          # Vercelデプロイ自動化設定
├── docker-compose.yml  # PostgreSQL 16 サービス
└── CLAUDE.md          # このファイル
```

### cook-scan/ (メイン本番アプリケーション)

Next.js 15フルスタックアプリケーション:
- **prisma/** - データベーススキーマとマイグレーション
- **public/** - 静的アセット
- **src/**
  - **app/** - Next.js App RouterページとAPIルート
    - `(auth)/` - 保護されたルート（ダッシュボード、レシピ、タグ）
    - `(auth-setup)/` - プロフィール設定フロー
    - `(public)/` - 公開ルート（ログイン）
  - **features/** - 機能ベースのモジュール（認証、レシピ、プロフィール、タグ）
  - **lib/** - 共有ライブラリ（Prismaクライアント）
  - **mastra/** - AIワークフロー実装
  - **types/** - TypeScript型定義
  - **utils/** - ユーティリティ関数（Supabase統合）

### sample/ (プロトタイプアプリケーション)

シンプルなリファレンス実装:
- **backend/** - HonoベースのAPIサーバー（AWS Lambda対応）
- **frontend/** - React + Vite + Material-UI SPA
- **docs/** - 追加ドキュメント

## 技術スタック

### メインアプリケーション (cook-scan/)

**フロントエンド:**
- フレームワーク: Next.js 15.5.6 (App Router, React Server Components)
- React: 19.1.0
- スタイリング: Tailwind CSS v4
- ビルドツール: Turbopack (Next.js経由)
- TypeScript: v5

**バックエンド:**
- フレームワーク: Next.js APIルート
- データベース: PostgreSQL 16 (Docker経由)
- ORM: Prisma 6.12.0
- 認証: Supabase Auth (@supabase/ssr, @supabase/supabase-js)

**AI/ML:**
- フレームワーク: Mastra v0.18.0 (@mastra/core v0.24.0)
- 画像処理: Google Gemini 2.5 Flash
- テキスト処理: OpenAI GPT-4o
- AI SDK: Vercel AI SDK v5.0.0

### サンプルアプリケーション

**フロントエンド:**
- React 19.1.0 + Vite 7.0.4
- UIライブラリ: Material-UI (MUI) v7.2.0
- ルーティング: React Router DOM v7.7.0

**バックエンド:**
- フレームワーク: Hono v4.8.5
- データベース: lowdb v7.0.1 (JSONファイルストレージ)
- デプロイ: AWS Lambda対応

## 開発コマンド

### メインアプリケーション (cook-scan/)

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# 本番ビルド
npm run build
npm run start

# データベース操作（ローカル開発は .env.migration を使用）
npm run db:generate      # Prisma Clientを生成
npm run db:migrate:dev   # マイグレーション実行（開発環境）
npm run db:push:dev      # スキーマ変更をプッシュ
npm run db:seed:dev      # データベースにシードデータを投入
npm run db:reset:dev     # データベースをリセット
npm run db:studio:dev    # Prisma Studioを開く（開発環境）
npm run db:studio:prod   # Prisma Studioを開く（本番環境）

# Docker操作
docker-compose up -d     # PostgreSQLを起動
docker-compose down      # PostgreSQLを停止
docker-compose ps        # ステータス確認
```

### サンプルアプリケーション

**バックエンド (sample/backend/):**
```bash
npm run dev              # 開発サーバー起動（ポート3001）
npm run build            # AWS Lambda用にビルド
npm run deploy           # AWSへデプロイ
```

**フロントエンド (sample/frontend/):**
```bash
npm run dev              # 開発サーバー起動
npm run build            # 本番ビルド
npm run lint             # ESLint実行
```

**Mastra (sample/backend/mastra/):**
```bash
npm run dev              # 開発モード
npm run build            # ビルド
npm run start            # サーバー起動
```

## アーキテクチャ

### AIワークフロー (Mastra)

レシピ抽出のコア処理は**2ステップワークフロー**を使用:

```typescript
cookScanWorkflow:
  ステップ1: imageToTextStep (Google Gemini 2.5 Flash)
    - OCRを使用して画像からテキストを抽出
    - 入力: ファイル（画像）
    - 出力: 抽出されたテキスト文字列

  ステップ2: convertTextToRecipeStep (OpenAI GPT-4o)
    - テキストを構造化されたレシピに変換
    - 入力: テキスト文字列
    - 出力: 構造化されたレシピJSON
```

**エージェント:**
1. `imageToTextAgent` - OCR専門家（エージェントはGPT-4o、ワークフローはGemini使用）
   - 場所: `src/mastra/agents/image-to-text-agent.ts`
   - 手書き文字やラベルを含むすべてのテキストを抽出

2. `convertTextToRecipeAgent` - レシピ構造化専門家（GPT-4o）
   - 場所: `src/mastra/agents/convert-text-to-recipe-agent.ts`
   - テキストを検証付きの構造化レシピフォーマットに解析

### データベーススキーマ (PostgreSQL via Prisma)

**主要テーブル:**

1. **users** - ユーザー管理（Supabase Auth統合）
   - `authId`経由でSupabaseに接続
   - リレーション: recipes, tagCategories, ocrProcessingHistory, recipeVersions

2. **recipes** - メインのレシピテーブル
   - フィールド: title, userId, parentRecipeId, imageUrl, memo
   - リレーション: ingredients, steps, recipeTags, sourceInfo, ocrProcessingHistory

3. **ingredients** - レシピの材料
   - フィールド: name, unit, notes
   - recipeとの多対一関係

4. **steps** - 調理手順
   - フィールド: orderIndex, instruction, timerSeconds
   - レシピごとに順序付きリスト

5. **tag_categories** - タグの整理
   - システムおよびユーザー定義のカテゴリ
   - 任意のuserId（システムの場合はnull）

6. **tags** - レシピタグ
   - カテゴリに所属
   - システムおよびユーザー定義

7. **recipe_tags** - 多対多リレーション
   - 複合キー: [recipeId, tagId]

8. **ocr_processing_history** - OCR処理ログ
   - 生のOCR結果と構造化データをJSONとして保存
   - recipeと一対一関係

9. **recipe_versions** - バージョン管理
   - レシピのスナップショットをJSONで保存
   - changeNoteで変更を追跡

10. **source_infos** - レシピのソースメタデータ
    - sourceType, sourceName, sourceUrl, pageNumber
    - recipeとの一対多関係（1つのレシピに複数のソース情報）

**データモデル:**

```typescript
interface Recipe {
  id: string;
  title: string;
  userId: string;
  parentRecipeId?: string;
  imageUrl?: string;
  memo?: string;
  ingredients: Ingredient[];
  steps: Step[];
  recipeTags: RecipeTag[];
  sourceInfo?: SourceInfo;
  ocrProcessingHistory?: OcrProcessingHistory;
  createdAt: Date;
  updatedAt: Date;
}

interface Ingredient {
  id: string;
  recipeId: string;
  name: string;
  unit?: string;
  notes?: string;
}

interface Step {
  id: string;
  recipeId: string;
  orderIndex: number;
  instruction: string;
  timerSeconds?: number;
}
```

### APIエンドポイント

#### メインアプリケーション (cook-scan/)

**APIルート:**
- `POST /(auth)/recipes/extract` - 画像からレシピを抽出（Mastraワークフロー使用）
- `GET /auth/confirm` - Supabase認証コールバック

**保護されたページ:**
- `GET /dashboard` - ユーザーダッシュボード
- `GET /recipes` - レシピ一覧
- `GET /recipes/[id]` - レシピ詳細
- `GET /recipes/[id]/edit` - レシピ編集
- `GET /recipes/upload` - アップロードインターフェース（クリップボード貼り付け対応）
- `GET /tags` - タグ管理（カテゴリ・タグのCRUD操作）
- `GET /profile/setup` - プロフィール設定

**公開ページ:**
- `GET /login` - ログインページ
- `GET /` - ルートページ（リダイレクト）

#### サンプルアプリケーション (backend/)

**REST API:**
```
GET  /api/health              # ヘルスチェック
POST /api/recipes/extract     # レシピ抽出（?save=trueで保存）
GET  /api/recipes             # 全レシピ一覧
GET  /api/recipes/:id         # 特定のレシピ取得
POST /api/recipes             # レシピ作成
PUT  /api/recipes/:id         # レシピ更新
DELETE /api/recipes/:id       # レシピ削除
```

**リクエスト/レスポンス例:**
```typescript
// レシピ抽出
POST /api/recipes/extract?save=true
Content-Type: multipart/form-data
Body: { image: File }

Response: {
  success: true,
  recipe: {
    title: string,
    ingredients: [{ name: string, unit: string }],
    steps: [{ instruction: string, timerSeconds: number | null }],
    memo: string | null
  }
}
```

### 機能ベースアーキテクチャ

コードは層ではなく機能で整理されています:

```
features/
├── auth/           # 認証ロジック
│   └── actions.ts  # Server Actions
├── profile/        # ユーザープロフィール管理
│   └── setup/
├── recipes/        # レシピのCRUD操作
│   ├── upload/     # アップロードと抽出
│   ├── edit/       # 編集機能
│   ├── detail/     # 詳細表示
│   └── delete/     # 削除機能
└── tags/           # タグ管理
    ├── actions.ts  # タグ・カテゴリのCRUD Server Actions
    ├── tag-item.tsx         # タグアイテムコンポーネント
    ├── category-item.tsx    # カテゴリアイテムコンポーネント
    └── tag-create-form.tsx  # タグ作成フォーム
```

### Next.jsルートグループ

URLに影響を与えずにルートを整理するために括弧を使用:
- `(auth)` - 認証レイアウト付きの認証済みルート
- `(auth-setup)` - プロフィール設定フロー
- `(public)` - 公開ルート

### Server Actionsパターン

すべてのミューテーションはNext.js Server Actions (`'use server'`)を使用:
- `/src/features/recipes/upload/actions.ts` - レシピアップロードと抽出
- `/src/features/recipes/edit/actions.ts` - レシピ編集
- `/src/features/auth/actions.ts` - 認証関連
- `/src/features/tags/actions.ts` - タグとカテゴリのCRUD操作

## 開発規約

### コードスタイル

1. **TypeScript Strictモード**: 常に有効
2. **パスエイリアス**: `src/`からのインポートには`@/*`を使用
   ```typescript
   import { prisma } from '@/lib/prisma'
   import { RecipeWithRelations } from '@/types/recipe'
   ```

3. **ファイル命名**:
   - Reactコンポーネント: PascalCase (例: `RecipeDisplay.tsx`)
   - ユーティリティ/ヘルパー: camelCase (例: `createClient.ts`)
   - Server Actions: `actions.ts`
   - APIルート: `route.ts`

4. **コンポーネント構成**:
   - デフォルトでServer Componentsを優先
   - 必要な場合のみ`'use client'`を使用（フック、イベント）
   - Client Componentsは小さく焦点を絞る

### データベース規約

1. **マイグレーション**: スキーマ変更には常にマイグレーションを使用
   ```bash
   npm run db:migrate:dev -- --name descriptive_migration_name
   ```

2. **環境ファイル**:
   - `.env` - メインアプリケーション（Supabase、APIキー）
   - `.env.migration` - マイグレーション用のローカルデータベース（localhost PostgreSQL）

3. **Prisma Client**: スキーマ変更後は必ず再生成
   ```bash
   npm run db:generate
   ```

4. **シード**: 開発データにはシードスクリプトを使用
   ```bash
   npm run db:seed:dev
   ```

### エラーハンドリング

1. **APIルート**: 構造化されたエラーレスポンスを返す
   ```typescript
   return NextResponse.json(
     { success: false, error: 'エラーメッセージ' },
     { status: 400 }
   )
   ```

2. **Server Actions**: エラーをスローするか結果オブジェクトを返す
   ```typescript
   if (!user) {
     throw new Error('認証されていません')
   }
   ```

3. **Client Components**: エラーバウンダリとtry-catchを使用

### セキュリティプラクティス

1. **認証**: すべての保護されたルートでSupabaseセッションを確認
2. **認可**: ミューテーション前にユーザー所有権を確認
3. **入力検証**: すべての入力にZodスキーマを使用
4. **SQLインジェクション**: Prismaを使用（パラメータ化クエリ）
5. **XSS**: Reactはデフォルトでエスケープ、dangerouslySetInnerHTMLには注意

### AI/MLベストプラクティス

1. **APIキー**: 環境変数に保存、コミットしない
2. **エラーハンドリング**: AIサービスの障害を適切に処理
3. **レート制限**: 本番デプロイメントに実装
4. **コスト管理**: API使用量を監視
5. **モデル選択**:
   - OCRにはGemini 2.5 Flashを使用（コスト効果的）
   - 構造化出力にはGPT-4oを使用（信頼性が高い）

## 環境変数

### メインアプリケーション (.env)

```env
# データベース
DATABASE_URL="postgresql://user:pass@host:port/dbname"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AI APIs
GOOGLE_API_KEY="your-google-api-key"
OPENAI_API_KEY="your-openai-api-key"
```

### ローカル開発 (.env.migration)

```env
# マイグレーション用のローカルPostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/cookscan_dev"
```

### サンプルアプリケーション (.env)

```env
# AI APIs
OPENAI_API_KEY="your-openai-api-key"
GOOGLE_GENERATIVE_AI_API_KEY="your-google-api-key"

# AWS（デプロイ用）
AWS_REGION="ap-northeast-1"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
```

## 一般的なタスク

### 新機能の追加

1. `src/features/`に機能ディレクトリを作成
2. `src/types/`に型を追加
3. 必要に応じてServer Actionsを作成
4. 必要に応じてAPIルートを追加
5. UIコンポーネントを作成
6. 必要に応じてデータベーススキーマを更新（マイグレーションで）

### データベーススキーマの変更

1. `prisma/schema.prisma`を編集
2. マイグレーションを作成:
   ```bash
   npm run db:migrate:dev -- --name your_migration_name
   ```
3. Prisma Clientを再生成:
   ```bash
   npm run db:generate
   ```
4. `src/types/`のTypeScript型を更新

### 新しいAIエージェントの追加

1. `src/mastra/agents/`にエージェントファイルを作成
2. モデルと指示でエージェントを定義
3. `src/mastra/index.ts`に登録
4. 必要に応じてワークフローに追加

### デバッグ

**データベース:**
```bash
npm run db:studio:dev  # Prisma Studioを開く
```

**ログ:**
- サーバー: ターミナル出力を確認
- クライアント: ブラウザコンソールを確認
- AI: Mastraログを確認（pinoロガー）

**Docker:**
```bash
docker-compose logs postgres  # PostgreSQLログを表示
docker-compose ps             # コンテナステータスを確認
```

## テスト

### 手動テスト

1. **レシピ抽出**:
   - 様々な画像タイプをアップロード（手書き、印刷、スクリーンショット）
   - OCR精度を確認
   - 構造化データフォーマットを確認

2. **データベース**:
   - CRUD操作をテスト
   - リレーション（外部キー）を確認
   - バージョン履歴を確認

3. **認証**:
   - ログイン/ログアウトフローをテスト
   - 保護されたルートを確認
   - ユーザー分離を確認

### 開発データ

開発データベースを設定するためにシードスクリプトを使用:
```bash
npm run db:seed:dev
```

## トラブルシューティング

### データベース接続の問題

1. PostgreSQLが実行中か確認:
   ```bash
   docker-compose ps
   ```

2. `.env.migration`の接続文字列を確認

3. ポートの可用性を確認（5433）

### マイグレーションエラー

1. Prismaスキーマの構文を確認
2. データベースがアクセス可能か確認
3. `prisma/migrations/`のマイグレーションファイルを確認
4. 必要に応じてリセット:
   ```bash
   npm run db:reset:dev
   ```

### ビルドエラー

1. Next.jsキャッシュをクリア:
   ```bash
   rm -rf .next
   ```

2. 依存関係を再インストール:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Prisma Clientを再生成:
   ```bash
   npm run db:generate
   ```

### AIサービスエラー

1. `.env`のAPIキーを確認
2. APIのレート制限とクォータを確認
3. Mastraログからエラーメッセージを確認
4. よりシンプルな入力でテスト

## デプロイ

### メインアプリケーション

**Vercel（Terraform経由）:**

このプロジェクトはTerraformを使用してVercelデプロイを自動化しています。

1. **Terraform設定** (`/terraform/main.tf`):
   - Vercelプロバイダー v4.0
   - プロジェクト設定（Next.js、ビルドコマンド等）
   - カスタムドメイン設定: `cookscan.aberyouta.jp`
   - 自動リダイレクト: `cook-scan.vercel.app` → `cookscan.aberyouta.jp`
   - デプロイリージョン: `hnd1` (東京)
   - ビルドコマンド: `npm run db:generate && next build`

2. **手動デプロイ（Terraform不使用の場合）:**
   - GitHubリポジトリを接続
   - 環境変数を設定
   - ビルド設定を構成:
     - ビルドコマンド: `npm run db:generate && next build`
     - 出力ディレクトリ: `.next`
     - ルートディレクトリ: `cook-scan`
   - デプロイ

**データベース:**
- マネージドPostgreSQLを使用（Supabase、Neon、Railway）
- マイグレーションを実行: `npx prisma migrate deploy`

**Terraformコマンド:**
```bash
cd terraform
terraform init      # 初期化
terraform plan      # 変更プレビュー
terraform apply     # デプロイ実行
```

### サンプルアプリケーション

**バックエンド（AWS Lambda）:**
```bash
cd sample/backend
npm run build
npm run deploy
```

**フロントエンド（静的ホスティング）:**
```bash
cd sample/frontend
npm run build
# dist/をS3、Netlify、またはVercelにデプロイ
```

## 主要ファイルリファレンス

### 設定ファイル

- `/cook-scan/prisma/schema.prisma` - データベーススキーマ
- `/cook-scan/next.config.ts` - Next.js設定
- `/cook-scan/tailwind.config.ts` - Tailwind CSS設定
- `/cook-scan/tsconfig.json` - TypeScript設定
- `/cook-scan/eslint.config.mjs` - ESLint設定
- `/docker-compose.yml` - PostgreSQLセットアップ
- `/terraform/main.tf` - Vercelデプロイ自動化設定
- `/terraform/variable.tf` - Terraform変数定義

### コアアプリケーションファイル

- `/cook-scan/src/lib/prisma.ts` - Prismaクライアントインスタンス
- `/cook-scan/src/utils/supabase/server.ts` - Supabaseサーバークライアント
- `/cook-scan/src/utils/supabase/client.ts` - Supabaseクライアントサイドクライアント
- `/cook-scan/src/mastra/index.ts` - Mastra設定
- `/cook-scan/src/mastra/workflows/cook-scan-workflow.ts` - メインワークフロー

### サンプルアプリケーションファイル

- `/sample/backend/src/index.ts` - Hono APIサーバー
- `/sample/backend/src/routes/recipes.ts` - レシピエンドポイント
- `/sample/backend/mastra/src/mastra/index.ts` - Mastraセットアップ
- `/sample/frontend/src/App.tsx` - Reactアプリルート

## 最近追加された機能

### タグ管理システム（2024年11月）

完全なCRUD操作を持つタグ管理機能:

**タグカテゴリ:**
- カテゴリの作成・編集・削除
- システムカテゴリとユーザーカテゴリの区別
- カテゴリごとのタグ整理

**タグ:**
- タグの作成・編集・削除
- カテゴリへの所属
- レシピへのタグ付け

**実装ファイル:**
- `/src/features/tags/actions.ts` - Server Actions
- `/src/app/(auth)/tags/page.tsx` - タグ管理ページ
- `/src/features/tags/*.tsx` - UIコンポーネント

**使用方法:**
```typescript
// タグカテゴリ作成
await createTagCategory('料理ジャンル', '料理の種類を分類')

// タグ作成
await createTag(categoryId, '和食', '日本料理')

// タグ編集
await updateTag(tagId, '和食・日本料理', '伝統的な日本料理')

// タグ削除
await deleteTag(tagId)
```

### クリップボード画像貼り付け（2024年11月）

レシピアップロード画面でクリップボードから画像を直接貼り付け可能:
- スクリーンショットの直接貼り付け
- 画像ファイルのコピー＆ペースト
- ドラッグ＆ドロップとの併用

### Terraformインフラ自動化（2024年11月）

Vercelデプロイの完全自動化:
- プロジェクト設定の自動化
- カスタムドメイン設定
- ビルド設定の一元管理
- Terraform Cloud連携

## 追加リソース

- **Next.jsドキュメント**: https://nextjs.org/docs
- **Prismaドキュメント**: https://www.prisma.io/docs
- **Mastraドキュメント**: https://mastra.ai/docs
- **Supabaseドキュメント**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Terraform Vercelプロバイダー**: https://registry.terraform.io/providers/vercel/vercel/latest/docs

## AIアシスタントへの注意事項

1. **データベース変更**: 常にマイグレーションを作成、本番では`db push`を使用しない
2. **型安全性**: Prisma型とTypeScript strictモードを活用
3. **ServerとClient**: Next.jsコンポーネントの境界に注意
4. **認証**: データアクセス前に必ずユーザーセッションを確認
5. **AIコスト**: AIワークフローを変更する際はAPIコストに注意
6. **モノレポ**: これはモノレポであることを忘れずに - 変更が複数のアプリに影響する可能性
7. **環境**: コンテキストに応じて正しい`.env`ファイルを使用（メインアプリ vs マイグレーション）
8. **機能構成**: 新しいコードは機能ベース構造に従う
9. **エラーハンドリング**: ユーザーフレンドリーなエラーメッセージを提供
10. **セキュリティ**: すべての入力を検証、特にユーザー生成コンテンツ
11. **タグ管理**: タグとカテゴリの作成時は必ずユーザー所有権を確認
12. **インフラ変更**: Terraformファイル変更時は慎重に、本番環境に影響
13. **リレーション**: SourceInfoは一対多関係（1レシピ:複数ソース）に注意
