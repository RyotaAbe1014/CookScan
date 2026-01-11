# CLAUDE.md

このファイルは、CookScanリポジトリでコードを扱う際のClaude Code (claude.ai/code)および他のAIアシスタントへのガイダンスを提供します。

## プロジェクト概要

CookScanは、AIを使用して画像（スクリーンショット、写真、手書きメモ）からレシピ情報を抽出し、構造化されたJSONデータに変換するレシピ抽出・管理Webアプリケーションです。OCRとLLM技術を使用してレシピデータを解析・構造化します。

**主な機能:**
- AI搭載の画像からのレシピ抽出
- テキスト入力からのレシピ構造化
- クリップボードからの画像貼り付け対応
- ユーザー認証とプロフィール管理
- レシピのバージョン管理と履歴追跡
- タグの作成・編集・削除機能
- カテゴリ付きタグベースの整理（システムカテゴリ対応）
- レシピ作成・編集時のタグ紐付け
- レシピ詳細画面でのタグ表示（カテゴリ別グループ化）
- **調理タイマー機能**（ステップごとのタイマー、クロスタブ同期）
- **レシピスクリーンショット機能**
- レスポンシブデザイン（モバイル対応）
- レシピのソース帰属
- OCR処理履歴

## リポジトリ構造

```
CookScan/
├── cook-scan/          # メインのNext.js本番アプリケーション
├── terraform/          # Vercelデプロイ自動化設定
├── .husky/             # Git pre-commitフック
├── docker-compose.yml  # PostgreSQL 16 サービス
├── mise.toml           # ツールバージョン管理
├── package.json        # モノレポルート（lint-staged設定）
└── CLAUDE.md           # このファイル
```

### cook-scan/ (メイン本番アプリケーション)

Next.js 16フルスタックアプリケーション:
- **prisma/** - データベーススキーマとマイグレーション
- **public/** - 静的アセット
- **src/**
  - **app/** - Next.js App RouterページとAPIルート
    - `(auth)/` - 保護されたルート（ダッシュボード、レシピ、タグ、設定）
    - `(auth-setup)/` - プロフィール設定フロー
    - `(public)/` - 公開ルート（ログイン）
    - `auth/confirm/` - 認証コールバック
  - **components/** - 共有UIコンポーネント
    - `ui/` - 再利用可能なUIコンポーネント（テスト付き）
    - `icons/` - SVGアイコンコンポーネント（30種類以上）
    - `layouts/` - レイアウトラッパー
    - `navigation/` - ナビゲーションコンポーネント
  - **features/** - 機能ベースのモジュール
    - `auth/` - 認証・ログアウト
    - `dashboard/` - ダッシュボード表示
    - `profile/` - プロフィール管理（setup, edit, password）
    - `recipes/` - CRUD操作（upload, edit, detail, delete, list）
    - `tags/` - タグとカテゴリ管理
    - `errors/` - エラーページコンポーネント
  - **hooks/** - カスタムReactフック
  - **lib/** - 共有ライブラリ（Prisma、Supabaseクライアント）
  - **mastra/** - AIワークフロー実装
  - **types/** - TypeScript型定義
  - **utils/** - ユーティリティ関数
  - **test/** - テストセットアップ

## 技術スタック

### メインアプリケーション (cook-scan/)

**フロントエンド:**
- フレームワーク: Next.js 16.1.1 (App Router, React Server Components)
- React: 19.2.3
- スタイリング: Tailwind CSS v4
- 状態管理: Jotai（アトムベースの状態管理）
- ビルドツール: Turbopack (Next.js経由)
- TypeScript: v5

**バックエンド:**
- フレームワーク: Next.js APIルート
- データベース: PostgreSQL 16 (Docker経由)
- ORM: Prisma 6.12.0
- 認証: Supabase Auth (@supabase/ssr, @supabase/supabase-js)

**AI/ML:**
- フレームワーク: Mastra v1.0.0-beta.14 (@mastra/core v1.0.0-beta.11)
- 画像処理: Google Gemini 2.5 Flash
- テキスト処理: OpenAI GPT-5-mini
- AI SDK: Vercel AI SDK v5.0.0

**その他のライブラリ:**
- Jotai + jotai-family（状態管理）
- modern-screenshot（スクリーンショット機能）
- Zod（バリデーション）

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
npm run test             # 全テスト実行（ウォッチモード）
npm run test:run         # 全テスト実行（単発）
npm run test:watch       # ウォッチモード
npm run test:coverage    # カバレッジレポート付き
npm run test:ui          # Vitest UI

# データベース操作（ローカル開発は .env.migration を使用）
npm run db:generate      # Prisma Clientを生成
npm run db:migrate:dev   # マイグレーション実行（開発環境）
npm run db:push:dev      # スキーマ変更をプッシュ
npm run db:seed:dev      # データベースにシードデータを投入
npm run db:reset:dev     # データベースをリセット
npm run db:studio:dev    # Prisma Studioを開く（開発環境）
npm run db:studio:prod   # Prisma Studioを開く（本番環境）
npm run db:format        # Prismaスキーマをフォーマット
npm run db:validate      # Prismaスキーマを検証

# Docker操作
docker-compose up -d     # PostgreSQLを起動
docker-compose down      # PostgreSQLを停止
docker-compose ps        # ステータス確認
```

## テストとコード品質

### テストフレームワーク

メインアプリケーションはVitest + React Testing Libraryを使用:
- **Vitest 4.0.15** - ユニット/コンポーネントテスト
- **jsdom** - DOMシミュレーション環境
- **React Testing Library 16.3.0** - Reactコンポーネントテスト
- **V8カバレッジ** - HTML/JSON/textレポート

**テスト実行:**
```bash
# 全テスト実行（ウォッチモード）
npm run test

# 単発実行
npm run test:run

# カバレッジ付き
npm run test:coverage

# 特定ファイル/ディレクトリのテスト
npm run test -- src/features/recipes
npm run test -- input.test.tsx

# Vitest UI
npm run test:ui
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
4. **機能コンポーネント** - MethodSelector、CookingTimerManager等
5. **Atoms** - Jotaiアトムのテスト
6. **ユーティリティ** - timer-persistence、url-validation等

### Pre-commit フック

Huskyとlint-stagedで自動チェック:
- **Husky** - Git hooksの管理
- **lint-staged** - ステージ済みファイルのみをリント

```bash
# .git/hooksにセットアップ（npm installで自動実行）
npx husky install
```

**lint-staged設定（ルートpackage.json）:**
```json
{
  "lint-staged": {
    "cook-scan/**/*.{ts,tsx}": ["eslint --fix"],
    "cook-scan/prisma/schema.prisma": ["npx prisma format", "npx prisma validate"]
  }
}
```

コミット時に自動的にESLintが実行され、エラーがあるとコミットがブロックされます。

### コード品質チェック

```bash
# ESLintチェック（全src）
npm run lint

# Prismaスキーマ検証
npm run db:validate

# Prismaスキーマフォーマット
npm run db:format
```

## アーキテクチャ

### AIワークフロー (Mastra)

レシピ抽出のコア処理は**2つのワークフロー**を提供:

**1. cookScanWorkflow（画像→レシピ）:**
```typescript
cookScanWorkflow:
  ステップ1: imageToTextStep (Google Gemini 2.5 Flash)
    - OCRを使用して画像からテキストを抽出
    - 入力: ファイル（画像、最大5ファイル）
    - 出力: 抽出されたテキスト文字列

  ステップ2: convertTextToRecipeStep (OpenAI GPT-5-mini)
    - テキストを構造化されたレシピに変換
    - 入力: テキスト文字列
    - 出力: 構造化されたレシピJSON
```

**2. textToRecipeWorkflow（テキスト→レシピ）:**
```typescript
textToRecipeWorkflow:
  ステップ1: convertTextToRecipeStep (OpenAI GPT-5-mini)
    - テキストを直接構造化されたレシピに変換
    - 入力: テキスト文字列
    - 出力: 構造化されたレシピJSON
```

**エージェント:**
1. `imageToTextAgent` - OCR専門家（GPT-4o-mini）
   - 場所: `src/mastra/agents/image-to-text-agent.ts`
   - 手書き文字やラベルを含むすべてのテキストを抽出

2. `convertTextToRecipeAgent` - レシピ構造化専門家（GPT-5-mini）
   - 場所: `src/mastra/agents/convert-text-to-recipe-agent.ts`
   - テキストを検証付きの構造化レシピフォーマットに解析
   - `structuredOutput`でZodスキーマによる型安全な出力

**APIルート:**
- `POST /(auth)/recipes/extract/file` - 画像ファイルからの抽出
- `POST /(auth)/recipes/extract/text` - テキストからの抽出

### データベーススキーマ

詳細はPrismaスキーマ（`/prisma/schema.prisma`）を参照。主な構造：

- **User** - Supabase Auth統合、レシピ・タグ・カテゴリとの関連
- **Recipe** - メインレシピデータ、親子関係対応
  - ingredients, steps, tags, versions, sourceInfo, ocrHistory を関連
- **Ingredient** - 材料（name, unit, notes）
- **Step** - 調理手順（orderIndex, **timerSeconds**）
- **TagCategory** - ユーザー作成またはシステムカテゴリ
- **Tag** - カテゴリ内のタグ（ユーザー所有権）
- **RecipeTag** - 多対多リレーション
- **OcrProcessingHistory** - OCR結果とメタデータ（JSON）
- **RecipeVersion** - バージョン履歴（スナップショット）
- **SourceInfo** - ソース帰属（書籍、URL、ページ番号）

**最近のスキーマ変更:**
- `timerSeconds`フィールドをStepモデルに追加（タイマー機能用）
- ユーザータグ関係とシステムカテゴリのサポート

### 状態管理 (Jotai)

クライアント側の複雑な状態管理にJotaiアトムを使用:

**タイマー機能のアトム（`src/features/recipes/detail/atoms/`）:**
```typescript
// レシピごとのタイマー状態（atomFamily使用）
recipeTimerStatesAtomFamily(recipeId)

// 全タイマー停止用アトム
stopAllTimersAtomFamily(recipeId)

// 古いタイマー状態のクリーンアップ（24時間）
cleanupOldTimerStatesAtom

// アクティブタイマーを持つレシピ一覧
activeTimerRecipesAtom
```

**特徴:**
- `atomWithStorage`によるlocalStorage永続化
- クロスタブ同期
- 24時間後の自動クリーンアップ
- `PersistedTimerState`型で running/paused 状態を追跡

### 機能ベースアーキテクチャ

コードは層ではなく機能で整理（`/src/features/`）：

```
features/
├── auth/           # 認証・ログアウト
│   ├── login/
│   ├── logout-button.tsx
│   ├── actions.ts
│   └── auth-utils.ts
├── dashboard/      # ダッシュボード表示
│   ├── dashboard-content.tsx
│   ├── welcome-section.tsx
│   ├── features-overview.tsx
│   └── quick-actions.tsx
├── profile/        # プロフィール管理
│   ├── setup/      # 初期設定フロー
│   ├── edit/       # プロフィール編集
│   └── password/   # パスワード変更
├── recipes/        # レシピCRUD
│   ├── components/ # 共有コンポーネント
│   │   ├── form-actions/      # デスクトップ・モバイルフォーム
│   │   ├── ingredient-input/  # 材料入力
│   │   └── step-input/        # 手順入力
│   ├── detail/     # レシピ詳細表示
│   │   ├── atoms/  # Jotaiアトム
│   │   ├── hooks/  # カスタムフック
│   │   ├── cooking-timer-manager.tsx
│   │   ├── step-timer.tsx
│   │   └── recipe-detail-actions.tsx
│   ├── edit/       # レシピ編集
│   ├── upload/     # レシピ作成
│   ├── list/       # レシピ一覧
│   ├── delete/     # レシピ削除
│   ├── types/      # 型定義
│   └── actions.ts
├── tags/           # タグとカテゴリ管理
│   ├── tag-create-form.tsx
│   ├── category-item.tsx
│   ├── tag-item.tsx
│   └── actions.ts
└── errors/         # エラーページ
    ├── error-page-content.tsx
    └── not-found-page-content.tsx
```

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

8. **EmptyState** - 空状態表示
   - アイコン、タイトル、説明、アクション対応

9. **PageLoading** - ページローディング表示

すべてのコンポーネントは100%テストカバレッジを目指します。

### アイコンコンポーネント

30種類以上のSVGアイコンをReactコンポーネントとして提供（`/src/components/icons/`）:
- 各アイコンは独立したコンポーネントファイル
- 統一されたpropsインターフェース（className、size等）
- `index.ts`でまとめてエクスポート

### レイアウトコンポーネント

ページレイアウト用のラッパーコンポーネント（`/src/components/layouts/`）:
- `auth-layout-wrapper.tsx` - 認証済みページ用レイアウト
- `header.tsx` - ヘッダーコンポーネント
- `page-container.tsx` - ページコンテナ

### ナビゲーションコンポーネント

ナビゲーション用コンポーネント（`/src/components/navigation/`）:
- `back-to-dashboard-link.tsx` - ダッシュボードへの戻りリンク
- `back-to-recipes-link.tsx` - レシピ一覧への戻りリンク

### Next.jsルートグループ

URLに影響を与えずにルートを整理するために括弧を使用:
- `(auth)` - 認証レイアウト付きの認証済みルート
- `(auth-setup)` - プロフィール設定フロー
- `(public)` - 公開ルート
- `auth/confirm/` - 認証コールバック

### Server Actions

すべてのミューテーションはNext.js Server Actions（`'use server'`）を使用。各機能フォルダに `actions.ts` で実装。

**特徴:**
- 複雑な操作にはPrismaトランザクション使用
- Zodによる入力バリデーション
- ユーザー所有権チェック
- `revalidatePath`によるキャッシュ再検証

### カスタムフック

再利用可能なReactフック（`/src/hooks/`）:
- `use-media-query.ts` - メディアクエリフック
- `useIsMobile()` - モバイル判定フック

### 調理タイマー機能

レシピ詳細画面でステップごとのタイマー機能を提供:

**コンポーネント:**
- `cooking-timer-manager.tsx` - グローバルタイマー管理
- `step-timer.tsx` - 個別ステップタイマーUI
- `recipe-detail-actions.tsx` - スクリーンショット機能含む
- `active-timer-banner.tsx` - レシピ一覧でのアクティブタイマー表示

**機能:**
- ステップごとの `timerSeconds` フィールド
- localStorage永続化
- クロスタブ同期
- ブラウザ通知
- 24時間後の自動クリーンアップ

### スクリーンショット機能

`modern-screenshot`ライブラリを使用したレシピのスクリーンショット機能:
- `recipe-detail-actions.tsx`で`domToJpeg`を使用
- レシピ表示のエクスポート

## 開発規約

### コードスタイル

1. **TypeScript Strictモード**: 常に有効
2. **パスエイリアス**: `src/`からのインポートには`@/*`を使用
   ```typescript
   import { prisma } from '@/lib/prisma'
   import { RecipeWithRelations } from '@/types/recipe'
   ```

3. **ファイル命名**:
   - Reactコンポーネント: kebab-case (例: `recipe-display.tsx`)
   - ユーティリティ/ヘルパー: kebab-case (例: `create-client.ts`)
   - Server Actions: `actions.ts`
   - APIルート: `route.ts`
   - テストファイル: `__tests__/`ディレクトリまたは`.test.ts(x)`接尾辞
   - アイコン: kebab-case (例: `arrow-left-icon.tsx`)

4. **コンポーネント構成**:
   - デフォルトでServer Componentsを優先
   - 必要な場合のみ`'use client'`を使用（フック、イベント）
   - Client Componentsは小さく焦点を絞る

5. **レスポンシブデザイン**:
   - モバイル用に別コンポーネントを用意（`*-mobile.tsx`）
   - `useIsMobile()`フックで判定

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

3. **カラーパレット（globals.css定義）**:
   - プライマリ: `indigo` (UI要素)
   - セカンダリ: `purple`
   - デストラクティブ: `red` (削除等)
   - グレー: `gray` (背景等)
   - アクセント: `blue`(手順), `green`(材料), `amber`(タグ)
   - ステータス: `success`, `warning`, `danger`

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
   - Jotaiアトムの状態変更

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

5. **トランザクション**: 複雑な操作にはPrismaトランザクションを使用
   ```typescript
   await prisma.$transaction(async (tx) => {
     // 複数の操作をアトミックに実行
   })
   ```

### エラーハンドリング

- **APIルート**: 構造化JSONレスポンス（`{success, error}` 形式）
- **Server Actions**: エラーをスロー
- **Client Components**: エラーバウンダリとtry-catch
- **Error Boundaries**: `(auth)/error.tsx`で認証済みルートのエラー処理
- **Not Found**: `(auth)/not-found.tsx`でレシピ等の404処理

### セキュリティプラクティス

- **認証**: 保護ルートでSupabaseセッション確認
- **認可**: ミューテーション前にユーザー所有権確認
- **入力検証**: Zodスキーマ使用
- **SQLインジェクション**: Prismaで対策
- **XSS**: Reactのデフォルトエスケープ活用
- **URL検証**: `url-validation.ts`でソースURLをサニタイズ

### AI/MLベストプラクティス

- **APIキー**: 環境変数保存、コミット禁止
- **エラーハンドリング**: AIサービス障害対応、ワークフローステータスチェック
- **レート制限**: 本番実装
- **モデル**: OCR→Gemini Flash（コスト効率）、構造化→GPT-5-mini（信頼性）
- **ファイル制限**: 画像アップロードは最大5ファイル

## 環境変数

**メインアプリ (.env):**
- `DATABASE_URL` - DB接続
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon Key
- `OPENAI_API_KEY` - OpenAI API Key
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Gemini API Key

**ローカル開発 (.env.migration):**
- ローカルPostgreSQL接続用（localhost:5433）

**詳細は`.env.example`等参照**

## よくあるタスク

**新機能追加:**
1. `src/features/`に機能ディレクトリを作成
2. `actions.ts` でServer Actions実装
3. UIコンポーネントを作成
4. 必要に応じてJotaiアトムを追加

**スキーマ変更:**
```bash
# 1. スキーマ編集
vim prisma/schema.prisma

# 2. マイグレーション作成
npm run db:migrate:dev -- --name xxx

# 3. Prisma Client再生成
npm run db:generate
```

**AIエージェント追加:**
1. `src/mastra/agents/`で実装
2. `src/mastra/index.ts`に登録
3. ワークフローに追加

**新しいアイコン追加:**
1. `src/components/icons/`にコンポーネント作成
2. `src/components/icons/index.ts`でエクスポート

**デバッグ:**
- DB: `npm run db:studio:dev`
- ログ: ターミナル（サーバー）/ ブラウザコンソール（クライアント）
- Docker: `docker-compose logs postgres`
- Mastra: Pinoロガーでログ出力

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
- ワークフローステータスをチェック

**タイマーが同期しない:**
- localStorageのデータを確認
- ブラウザの通知許可を確認

## デプロイ

**メインアプリケーション:**
- Vercel（`/terraform/main.tf` で自動化設定、カスタムドメイン: `cookscan.aberyouta.jp`）
- DB: Supabase等のマネージドPostgreSQL
- マイグレーション: `npx prisma migrate deploy`

## 主要ファイル

設定ファイルはプロジェクトルート、コアロジックは `/src/features/` 参照。特に以下：
- `/prisma/schema.prisma` - DBスキーマ
- `/src/mastra/workflows/cook-scan-workflow.ts` - 画像抽出ワークフロー
- `/src/mastra/workflows/text-to-recipe.ts` - テキスト抽出ワークフロー
- `/src/features/recipes/upload/actions.ts` - レシピ作成ロジック
- `/src/features/recipes/detail/atoms/timer-atoms.ts` - タイマー状態管理
- `/src/features/tags/actions.ts` - タグ管理ロジック
- `/src/app/globals.css` - Tailwind CSS変数とカスタムテーマ

## 追加リソース

- **Next.jsドキュメント**: https://nextjs.org/docs
- **Prismaドキュメント**: https://www.prisma.io/docs
- **Mastraドキュメント**: https://mastra.ai/docs
- **Supabaseドキュメント**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Jotaiドキュメント**: https://jotai.org/docs
- **Terraform Vercelプロバイダー**: https://registry.terraform.io/providers/vercel/vercel/latest/docs

## AIアシスタントへの注意事項

1. **データベース変更**: 常にマイグレーションを作成、本番では`db push`を使用しない
2. **型安全性**: Prisma型とTypeScript strictモードを活用
3. **ServerとClient**: Next.jsコンポーネントの境界に注意
4. **認証**: データアクセス前に必ずユーザーセッションを確認
5. **AIコスト**: AIワークフローを変更する際はAPIコストに注意
6. **環境**: コンテキストに応じて正しい`.env`ファイルを使用
7. **機能構成**: 新しいコードは機能ベース構造に従う
8. **エラーハンドリング**: ユーザーフレンドリーなエラーメッセージを提供
9. **セキュリティ**: すべての入力を検証、特にユーザー生成コンテンツ
10. **タグ管理**: タグとカテゴリの作成時は必ずユーザー所有権を確認
11. **タグ表示**: レシピ詳細ページではタグをカテゴリ別にグループ化して表示
12. **インフラ変更**: Terraformファイル変更時は慎重に、本番環境に影響
13. **リレーション**: SourceInfoは一対多関係（1レシピ:複数ソース）に注意
14. **Prismaインクルード**: タグ表示には `recipeTags: { include: { tag: { include: { category: true } } } }` のようなネストしたインクルードが必要
15. **Tailwind CSS v4**: グラデーション等で`bg-linear-to-r`を使用（v3の`bg-gradient-to-r`ではない）
16. **コンポーネントテスト**: UI要素を追加・変更した場合、対応するテストを追加する
17. **ESLint**: コミット前に`npm run lint`を実行、pre-commit hookで自動チェック実行
18. **テスト実行**: 機能変更時は`npm run test -- --watch`でテストを監視実行
19. **FormField**: レシピフォーム用の標準フォーム要素（UIコンポーネントに含まれる）
20. **Jotai状態管理**: タイマー等の複雑なクライアント状態にはJotaiアトムを使用
21. **モバイル対応**: レスポンシブデザインには`useIsMobile()`フックと`*-mobile.tsx`コンポーネントを活用
22. **アイコン**: 新しいアイコンは`/src/components/icons/`にコンポーネントとして追加
23. **スクリーンショット**: `modern-screenshot`の`domToJpeg`を使用
24. **タイマー永続化**: localStorageへの永続化と24時間クリーンアップを考慮
