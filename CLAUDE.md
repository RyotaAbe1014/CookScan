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
- レシピ作成・編集時のタグ紐付け
- レシピ詳細画面でのタグ表示（カテゴリ別グループ化）
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

# リント
npm run lint             # ESLintチェック

# テスト
npm run test             # 全テスト実行
npm run test -- --watch  # ウォッチモード
npm run test -- src/features/recipes  # 特定ディレクトリのテスト

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

## テストとコード品質

### テストフレームワーク

メインアプリケーションはVitest + React Testing Libraryを使用:
- **Vitest** - ユニット/コンポーネントテスト
- **jsdom** - DOMシミュレーション環境
- **React Testing Library** - Reactコンポーネントテスト

**テスト実行:**
```bash
# 全テスト実行
npm run test

# ウォッチモード（ファイル変更時に自動再実行）
npm run test -- --watch

# 特定ファイル/ディレクトリのテスト
npm run test -- src/features/recipes
npm run test -- input.test.tsx

# UI出力付きで実行
npm run test -- --ui
```

**テスト設定:**
- 設定ファイル: `/cook-scan/vitest.config.mts`
- グローバルセットアップ: `/src/test/setup.ts`
- テストファイルは`__tests__`ディレクトリまたは`.test.ts(x)`接尾辞で配置

### テストコンポーネント

テスト対象となるコンポーネントタイプ:
1. **UI コンポーネント** - `/src/components/ui/` 内のButton、Input、Card等
2. **フォーム** - ProfileSetupForm、RecipeEditForm等
3. **ダイアログ** - DeleteRecipeDialog等
4. **機能コンポーネント** - MethodSelector等

### Pre-commit フック

Huskyとlint-stagedで自動チェック:
- **Husky** - Git hooksの管理
- **lint-staged** - ステージ済みファイルのみをリント

```bash
# .git/hooksにセットアップ（npm installで自動実行）
npx husky install

# 手動でhookを追加する場合
npx husky add .husky/pre-commit "npm run lint"
```

コミット時に自動的にESLintが実行され、エラーがあるとコミットがブロックされます。

### コード品質チェック

```bash
# ESLintチェック（全src）
npm run lint

# TypeScript型チェック
npm run db:validate    # Prismaスキーマ検証

# Prismaスキーマフォーマット
npm run db:format
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

### データベーススキーマ

詳細はPrismaスキーマ（`/prisma/schema.prisma`）を参照。主な構造：

- **users** - Supabase Auth統合
- **recipes** - メインレシピデータ（ingredients, steps, tags, sourceInfo を関連）
- **tag_categories** / **tags** - カテゴリ付きタグシステム
- **recipe_tags** - 多対多リレーション
- **ocr_processing_history** - OCR結果とメタデータ
- **recipe_versions** - バージョン履歴

### ルートとAPI

主要ルートはREADME参照。主な機能：
- `POST /(auth)/recipes/extract` - 画像抽出（Mastraワークフロー）
- `(auth)` ルート - 認証済みユーザー向け（ダッシュボード、レシピ、タグ）
- `(public)` ルート - ログインページ

### 機能ベースアーキテクチャ

コードは層ではなく機能で整理（`/src/features/`）：
- **auth/** - 認証・ログアウト
- **profile/setup/** - プロフィール設定フロー
- **recipes/** - CRUD操作（upload, edit, detail, delete各フォルダ）
- **tags/** - タグとカテゴリ管理（CRUD操作）

各機能フォルダは `actions.ts`（Server Actions）とUIコンポーネントで構成。

### UI コンポーネントライブラリ

統一されたUIコンポーネントセットを提供（`/src/components/ui/`）:

1. **Button** - ボタン要素
   - バリアント: `primary` (indigo), `secondary` (gray), `destructive` (red)
   - サイズ: `sm`, `md` (デフォルト), `lg`
   - 無効状態、ローディング状態対応

2. **Input** - テキスト入力フィールド
   - エラー状態表示
   - プレースホルダーサポート
   - 読み取り専用モード

3. **Select** - セレクトボックス
   - オプショングループ対応
   - デフォルト値設定
   - 無効状態

4. **Textarea** - 複数行テキスト入力
   - リサイズ可能
   - 行数指定
   - キャラクター数制限表示可能

5. **Card** - コンテナコンポーネント
   - ヘッダー、ボディ、フッターセクション
   - パディングとシャドウ自動適用

6. **FormField** - フォーム用ラッパー
   - ラベル、エラーメッセージ表示
   - 入力要素と組み合わせて使用
   - バリデーション状態管理

7. **Alert** - 警告・情報メッセージ
   - バリアント: `info` (青), `warning` (黄), `error` (赤), `success` (緑)
   - アイコンとタイトル対応

すべてのコンポーネントは100%テストカバレッジを目指します。

### Next.jsルートグループ

URLに影響を与えずにルートを整理するために括弧を使用:
- `(auth)` - 認証レイアウト付きの認証済みルート
- `(auth-setup)` - プロフィール設定フロー
- `(public)` - 公開ルート

### Server Actions

すべてのミューテーションはNext.js Server Actions（`'use server'`）を使用。各機能フォルダに `actions.ts` で実装。

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
   - テストファイル: `__tests__/`ディレクトリまたは`.test.ts(x)`接尾辞

4. **コンポーネント構成**:
   - デフォルトでServer Componentsを優先
   - 必要な場合のみ`'use client'`を使用（フック、イベント）
   - Client Componentsは小さく焦点を絞る

### Tailwind CSS v4 規約

プロジェクトはTailwind CSS v4を使用:

1. **線形勾配構文**: `bg-linear-to-r` を使用（v4推奨）
   ```tsx
   // ✅ 正しい (v4)
   <div className="bg-linear-to-r from-blue-400 to-blue-600">

   // ❌ 古い (v3)
   // <div className="bg-gradient-to-r from-blue-400 to-blue-600">
   ```

2. **カラー変数**: `@apply`は最小限に、クラス直接使用を推奨
   ```tsx
   // ✅ 推奨
   <button className="bg-indigo-500 hover:bg-indigo-600 text-white">

   // ⚠️ 必要な場合のみ
   @apply bg-indigo-500 hover:bg-indigo-600 text-white
   ```

3. **値の指定**: 標準カラーパレットを使用
   - プライマリ: `indigo` (UI要素)
   - デストラクティブ: `red` (削除等)
   - グレー: `gray` (背景等)

### コンポーネントテスト規約

1. **テストの配置**: `__tests__`ディレクトリまたは`.test.tsx`ファイル
   ```
   src/components/ui/button.tsx
   src/components/ui/button.test.tsx

   または

   src/features/recipes/delete/delete-recipe-dialog.tsx
   src/features/recipes/delete/__tests__/delete-recipe-dialog.test.tsx
   ```

2. **テストの内容**: ユーザーインタラクション中心
   ```typescript
   import { render, screen } from '@testing-library/react'
   import userEvent from '@testing-library/user-event'

   describe('Button', () => {
     it('handles click events', async () => {
       const onClick = vi.fn()
       render(<Button onClick={onClick}>Click me</Button>)
       await userEvent.click(screen.getByText('Click me'))
       expect(onClick).toHaveBeenCalled()
     })
   })
   ```

3. **何をテストするか**:
   - ユーザーインタラクション（クリック、入力）
   - エラー状態の表示
   - 条件付きレンダリング
   - フォーム検証

4. **何をテストしないか**:
   - 細かい実装詳細
   - スタイリング（CSSクラス）
   - 外部ライブラリの動作

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

- **APIルート**: 構造化JSONレスポンス（`{success, error}` 形式）
- **Server Actions**: エラーをスロー
- **Client Components**: エラーバウンダリとtry-catch

### セキュリティプラクティス

- **認証**: 保護ルートでSupabaseセッション確認
- **認可**: ミューテーション前にユーザー所有権確認
- **入力検証**: Zodスキーマ使用
- **SQLインジェクション**: Prismaで対策
- **XSS**: Reactのデフォルトエスケープ活用

### AI/MLベストプラクティス

- **APIキー**: 環境変数保存、コミット禁止
- **エラーハンドリング**: AIサービス障害対応
- **レート制限**: 本番実装
- **モデル**: OCR→Gemini Flash（コスト効率）、構造化→GPT-4o（信頼性）

## 環境変数

**メインアプリ (.env):** DB接続、Supabase認証、AI APIキー
**ローカル開発 (.env.migration):** ローカルPostgreSQL接続用（localhost:5433）
**詳細は`.env.example`等参照**

## よくあるタスク

**新機能追加:** `src/features/`に機能ディレクトリ、`actions.ts` でServer Actions実装、UIコンポーネントを作成

**スキーマ変更:** `prisma/schema.prisma`編集 → `npm run db:migrate:dev --name xxx` → `npm run db:generate`

**AIエージェント追加:** `src/mastra/agents/`で実装 → `src/mastra/index.ts`に登録

**デバッグ:**
- DB: `npm run db:studio:dev`
- ログ: ターミナル（サーバー）/ ブラウザコンソール（クライアント）
- Docker: `docker-compose logs postgres`

**テストデータ:** `npm run db:seed:dev`

## トラブルシューティング

**PostgreSQL接続エラー:**
- `docker-compose ps` で実行確認、`.env.migration`の接続文字列を確認
- ポート5433の可用性確認

**マイグレーションエラー:**
- Prismaスキーマの構文確認
- `npm run db:reset:dev` でリセット

**ビルドエラー:**
- `npm run db:generate` でPrisma Clientを再生成
- `rm -rf .next node_modules && npm install` で再インストール

**AIサービスエラー:**
- `.env`のAPIキー確認
- Mastraログを確認

## デプロイ

**メインアプリケーション:**
- Vercel（`/terraform/main.tf` で自動化設定、カスタムドメイン: `cookscan.aberyouta.jp`）
- DB: Supabase等のマネージドPostgreSQL
- マイグレーション: `npx prisma migrate deploy`

**サンプルアプリケーション:**
- バックエンド: AWS Lambda（`cd sample/backend && npm run deploy`）
- フロントエンド: 静的ホスティング（Vercel等）

## 主要ファイル

設定ファイルはプロジェクトルート、コアロジックは `/src/features/` 参照。特に以下：
- `/prisma/schema.prisma` - DBスキーマ
- `/src/mastra/workflows/cook-scan-workflow.ts` - 画像抽出ワークフロー
- `/src/features/recipes/upload/actions.ts` - レシピ作成ロジック
- `/src/features/tags/actions.ts` - タグ管理ロジック

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
12. **タグ表示**: レシピ詳細ページではタグをカテゴリ別にグループ化して表示
13. **インフラ変更**: Terraformファイル変更時は慎重に、本番環境に影響
14. **リレーション**: SourceInfoは一対多関係（1レシピ:複数ソース）に注意
15. **Prismaインクルード**: タグ表示には `recipeTags: { include: { tag: { include: { category: true } } } }` のようなネストしたインクルードが必要
16. **Tailwind CSS v4**: グラデーション等で`bg-linear-to-r`を使用（v3の`bg-gradient-to-r`ではない）
17. **コンポーネントテスト**: UI要素を追加・変更した場合、対応するテストを追加する
18. **ESLint**: コミット前に`npm run lint`を実行、pre-commit hookで自動チェック実行
19. **テスト実行**: 機能変更時は`npm run test -- --watch`でテストを監視実行
20. **FormField**: レシピフォーム用の標準フォーム要素（UIコンポーネントに含まれる）
