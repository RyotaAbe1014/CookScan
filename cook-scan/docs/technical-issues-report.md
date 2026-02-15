# CookScan 技術的課題レポート

**作成日:** 2026-02-15
**対象:** CookScan プロジェクト全体

---

## 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [セキュリティに関する課題](#セキュリティに関する課題)
3. [入力バリデーションの課題](#入力バリデーションの課題)
4. [エラーハンドリングの課題](#エラーハンドリングの課題)
5. [型安全性の課題](#型安全性の課題)
6. [コード重複・保守性の課題](#コード重複保守性の課題)
7. [パフォーマンスの課題](#パフォーマンスの課題)
8. [テストの課題](#テストの課題)
9. [アーキテクチャの課題](#アーキテクチャの課題)
10. [ロギング・監視の課題](#ロギング監視の課題)
11. [ドキュメントの課題](#ドキュメントの課題)
12. [優先度別まとめ](#優先度別まとめ)

---

## プロジェクト概要

| 項目 | 技術スタック |
|------|-------------|
| フロントエンド | Next.js 16.1.5 (App Router), React 19.2.4, TypeScript 5.9.3 |
| スタイリング | Tailwind CSS v4 |
| 状態管理 | Jotai 2.16.1 |
| データベース | PostgreSQL + Prisma 6.12.0 |
| 認証 | Supabase Auth |
| AI/ML | Mastra 1.2.0 + OpenAI + Google Generative AI |
| テスト | Vitest 4.0.15 + Testing Library |
| デプロイ | Vercel + Terraform |

**ソースファイル数:** 約286ファイル
**テストファイル数:** 約81ファイル

---

## セキュリティに関する課題

### SEC-01: 環境変数の未検証アクセス【中】

**該当ファイル:**
- `src/backend/mastra/models/google.ts:4`
- `src/backend/mastra/models/openai.ts:4`
- `src/lib/supabase/middleware.ts:10-11`
- `src/lib/supabase/client.ts:5-6`
- `src/lib/supabase/server.ts:6-7`

**課題:** 複数のファイルで `process.env` の値を非nullアサーション (`!`) またはそのままアクセスしており、環境変数が未設定の場合にランタイムエラーが発生する。

```typescript
// 現状: 未検証のまま使用
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
```

**影響:** 本番環境で環境変数が未設定の場合、サイレントに失敗するか、予期しないランタイムクラッシュが発生する。

**推奨対応:** `src/lib/supabase/admin.ts` のようにアプリケーション起動時に全環境変数を検証する仕組みを導入する。Zodスキーマによる環境変数バリデーションが望ましい。

---

### SEC-02: リダイレクトURLの未検証【中】

**該当ファイル:** `src/features/profile/invite/actions.ts:28`

**課題:**

```typescript
redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
```

`NEXT_PUBLIC_APP_URL` 環境変数がリダイレクトURLに直接使用されており、ホワイトリストによるドメイン検証がない。

**影響:** 環境変数が不正に設定された場合、ユーザーをフィッシングサイトにリダイレクトさせる可能性がある。

**推奨対応:** 許可されたオリジンのホワイトリストを設けてバリデーションを行う。

---

## 入力バリデーションの課題

### VAL-01: ファイルアップロードのタイプ・サイズ未検証【高】

**該当ファイル:** `src/app/(auth)/recipes/extract/file/route.ts:9-23`

**課題:** ファイルアップロードのAPIルートで、ファイル数のチェックはあるが以下の検証が不足している:

- ファイルタイプ（MIMEタイプ）の検証なし
- ファイルサイズの制限なし
- ファイル内容の妥当性チェックなし

```typescript
const files = formData.getAll('file')
if (files.length === 0) { ... }
if (files.length > MAX_FILES) { ... }
// ファイルタイプ・サイズのバリデーションなし
```

**影響:** 非画像ファイルの処理、巨大ファイルによるメモリ枯渇、悪意のあるファイルの処理が可能。

**推奨対応:**

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

for (const file of files) {
  if (!ALLOWED_TYPES.includes(file.type)) { ... }
  if (file.size > MAX_FILE_SIZE) { ... }
}
```

---

### VAL-02: 文字列フィールドの最大長未設定【中】

**該当ファイル:**
- `src/backend/domain/recipes/validators.ts:45` (`title`)
- `src/backend/domain/shopping-items/validators.ts:9` (`name`)
- `src/backend/domain/tags/validators.ts` (複数フィールド)
- `src/backend/domain/users/validators.ts:29` (`name`)

**課題:** Zodスキーマで `.min()` は設定されているが `.max()` が未設定。

```typescript
// 現状: 最大長の制限なし
title: z.string().min(1, 'タイトルを入力してください'),
memo: z.string().optional(),
```

**影響:** 大量のテキスト送信によるDB負荷増大やメモリ問題の可能性。

**推奨対応:** 全テキストフィールドに `.max()` 制約を追加する。

---

### VAL-03: タイマー秒数の正数バリデーション未設定【低】

**該当ファイル:** `src/backend/domain/recipes/validators.ts:20`

**課題:**

```typescript
timerSeconds: z.number().optional(), // 負数や0も許容される
```

**推奨対応:** `z.number().positive().optional()` に変更する。

---

## エラーハンドリングの課題

### ERR-01: 汎用的なエラーレスポンス【高】

**該当ファイル:**
- `src/app/(auth)/recipes/extract/text/route.ts:40-45`
- `src/app/(auth)/recipes/extract/file/route.ts:47-52`

**課題:** APIルートのcatchブロックで、エラーの種別に関わらず一律のレスポンスを返している。

```typescript
catch (error) {
  console.error(error)
  return NextResponse.json(
    { success: false, error: 'Failed to process request' },
    { status: 500 }
  )
}
```

**問題点:**
- エラー監視サービスとの連携なし
- バリデーションエラー、タイムアウト、レートリミットの区別なし
- リクエストIDによるトレーシング不可

**推奨対応:** エラー種別に応じたステータスコードとメッセージの返却、構造化ロギングの導入。

---

### ERR-02: エラーメッセージの文字列マッチング【中】

**該当ファイル:**
- `src/features/shopping-list/actions.ts:81-86, 109-114, 133-138, 159-161`
- `src/features/tags/actions.ts` (複数箇所)
- `src/features/recipes/detail/actions.ts`

**課題:** エラー分類がメッセージの文字列マッチングに依存している。

```typescript
if (error.message.includes('見つかりません')) {
  return failure(Errors.notFound('アイテム'))
}
if (error.message.includes('権限がありません')) {
  return failure(Errors.forbidden(error.message))
}
```

**問題点:**
- エラーメッセージの変更でハンドリングが壊れる
- 日本語テキストがエラー判定の境界になっている
- 異なるファイルに散在する同じロジック

**推奨対応:** カスタムエラークラスまたはエラーコードの列挙型を導入し、型安全なエラー分類を実現する。

```typescript
// 推奨: カスタムエラークラス
class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND' as const
}
class ForbiddenError extends AppError {
  readonly code = 'FORBIDDEN' as const
}
```

---

### ERR-03: サイレントなcatchブロック【中】

**該当ファイル:** `src/lib/supabase/server.ts:14-22`

**課題:** Server Component からの呼び出し時にエラーを意図的に無視しているが、実際の問題を隠蔽する可能性がある。

```typescript
} catch {
  // The `setAll` method was called from a Server Component.
  // This can be ignored if you have middleware refreshing user sessions.
}
```

---

## 型安全性の課題

### TYPE-01: テストコードでの `any` 型使用【中】

**該当ファイル:**
- `src/backend/services/recipes/__tests__/recipe.service.test.ts:42`
- `src/features/recipes/upload/__tests__/image-upload.test.tsx:247`
- `src/features/recipes/upload/__tests__/recipe-upload-content.test.tsx:18, 37, 56`
- `src/features/recipes/upload/__tests__/recipe-form.test.tsx:25`

**課題:**

```typescript
vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => callback(mockTx))
```

**影響:** テストの型安全性が損なわれ、リファクタリング時に型エラーを検出できない。

**推奨対応:** 適切な型定義またはジェネリクスを使用して `any` を排除する。

---

### TYPE-02: JSON.parseの型安全性不足【低】

**該当ファイル:** `src/features/recipes/detail/atoms/timer-atoms.ts:49`

**課題:**

```typescript
const parsed = JSON.parse(stored) as Array<[string, PersistedTimerState]>
```

`JSON.parse()` の戻り値に対して型アサーションのみで、スキーマバリデーションがない。

**推奨対応:** Zodスキーマでパース結果を検証する。

---

## コード重複・保守性の課題

### DUP-01: エラーハンドリングパターンの重複【中】

**該当ファイル:**
- `src/features/shopping-list/actions.ts` (7箇所のcatchブロック)
- `src/features/tags/actions.ts` (7箇所のcatchブロック)
- `src/features/recipes/upload/actions.ts`
- `src/features/recipes/detail/actions.ts`

**課題:** 同一のエラーハンドリングパターンがコピー&ペーストで複数ファイルに散在している。

```typescript
// このパターンが10箇所以上に重複
} catch (error) {
  console.error('Failed to X:', error)
  if (error instanceof Error) {
    if (error.message.includes('見つかりません')) {
      return failure(Errors.notFound('Y'))
    }
    if (error.message.includes('権限がありません')) {
      return failure(Errors.forbidden(error.message))
    }
  }
  return failure(Errors.server('Z'))
}
```

**影響:** エラーハンドリング戦略の変更時に全箇所を修正する必要があり、修正漏れのリスクが高い。

**推奨対応:** 共通のエラーハンドラーラッパー関数を作成する。

```typescript
function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: { entityName: string; operation: string }
): Promise<Result<T>> {
  try {
    return success(await fn())
  } catch (error) {
    return handleActionError(error, context)
  }
}
```

---

## パフォーマンスの課題

### PERF-01: ページネーション未実装のハードコード制限【中】

**該当ファイル:** `src/backend/repositories/recipe-relation.repository.ts:35`

**課題:**

```typescript
return prisma.recipe.findMany({
  ...
  take: 20, // ハードコードされた制限
})
```

**影響:** レシピが20件を超えるユーザーは子レシピとして選択できないアイテムが出る。ページネーションパラメータがないため、追加読み込みも不可。

**推奨対応:** カーソルベースのページネーションを実装する。

---

### PERF-02: 循環参照チェックのN+1クエリ問題【中】

**該当ファイル:** `src/backend/repositories/recipe-relation.repository.ts:114-122`

**課題:**

```typescript
while (queue.length > 0) {
  const currentId = queue.shift()!
  const children = await prisma.recipeRelation.findMany({
    where: { parentRecipeId: currentId }, // ループ内クエリ
    select: { childRecipeId: true },
  })
}
```

**影響:** 階層が深い場合、キューの要素ごとにDBクエリが発行される。

**推奨対応:** 再帰CTEクエリまたはバッチロードで一括取得する。

---

### PERF-03: 買い物リストの並べ替えにおける競合状態【中】

**該当ファイル:**
- `src/backend/repositories/shopping-item.repository.ts:93-101`
- `src/backend/services/shopping-items/shopping-item.service.ts:33-36`

**課題:** 並べ替え操作とアイテム作成で競合状態が発生する可能性がある。

```typescript
// 2つの逐次クエリ間で別リクエストが割り込む可能性
const maxOrder = await ShoppingItemRepository.getMaxDisplayOrder(userId)
const item = await ShoppingItemRepository.createShoppingItem(userId, name, maxOrder + 1, memo)
```

**推奨対応:** データベースシーケンスまたはアトミックなインクリメント操作を使用する。

---

## テストの課題

### TEST-01: テストカバレッジの不足【中】

**現状:**
- テストファイル: 約81ファイル
- ソースファイル: 約286ファイル
- **カバレッジ率: 約28%**

**未テスト領域:**
- APIルート（`src/app/(auth)/recipes/extract/` 配下）
- サービス層の包括的テスト
- エラーパスのテスト
- 複数ステップのワークフローの統合テスト
- E2Eテスト

**推奨対応:** クリティカルパスのカバレッジ80%以上を目標にテストを追加する。

---

### TEST-02: エラーケースのテスト不足【中】

**課題:** テストがハッピーパスに偏っており、以下のケースがテストされていない:
- 不正な入力
- データベースエラー
- 権限チェックの失敗
- 同時実行操作
- 大量データ

---

## アーキテクチャの課題

### ARCH-01: AIエージェントの指示文が未実装【高】

**該当ファイル:** `src/backend/mastra/agents/recommend-alternative-agent.ts:7`

**課題:**

```typescript
// TODO: Add instructions
instructions: `

`,
```

エージェントの指示文が空のままTODOコメントが残されており、この機能は実質的に未完成。

**影響:** 代替レシピ推薦機能が正しく動作しない。

**推奨対応:** 適切な指示文を設計・実装する。

---

### ARCH-02: APIルートの認証チェック不足【中】

**該当ファイル:**
- `src/app/(auth)/recipes/extract/text/route.ts`
- `src/app/(auth)/recipes/extract/file/route.ts`

**課題:** `(auth)` ディレクトリ配下のAPIルートでユーザー認証の検証が行われていない。

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // 認証チェックなし
    const workflow = mastra.getWorkflow('textToRecipeWorkflow')
  }
}
```

**影響:** ミドルウェアで保護されていない場合、未認証ユーザーがAIリソースを消費できる。

**推奨対応:** ルートハンドラ内でも認証トークンの検証を行う。

---

## ロギング・監視の課題

### LOG-01: 構造化ロギングの未導入【低】

**現状:** プロジェクト全体で `console.error()` が45箇所以上使用されている。

**問題点:**
- ログレベル（info, warn, error, debug）の区分なし
- 構造化ログ（JSON形式）未対応
- リクエストIDによるトレーシング不可
- 集約ログサービスとの連携なし

**推奨対応:** 構造化ロギングライブラリ（pino等）の導入と、リクエストIDの付与。

---

## ドキュメントの課題

### DOC-01: API仕様書の未整備【中】

**課題:** APIルートに対するOpenAPI/Swagger等のドキュメントが存在しない。

**該当ルート:**
- `/app/(auth)/recipes/extract/text/route.ts`
- `/app/(auth)/recipes/extract/file/route.ts`
- `/app/auth/confirm/route.ts`

---

### DOC-02: READMEの環境変数名の誤り【低】

**該当ファイル:** `cook-scan/README.md:34-43`

**課題:** READMEに記載されている環境変数名がコード内の実際の名前と不一致。

```
# README記載
GOOGLE_API_KEY=YOUR_GOOGLE_KEY

# 実際のコード内
GOOGLE_GENERATIVE_AI_API_KEY=...
```

---

## 優先度別まとめ

### 課題一覧

| ID | カテゴリ | 重要度 | 課題概要 |
|----|---------|--------|---------|
| VAL-01 | 入力バリデーション | 高 | ファイルアップロードのタイプ・サイズ未検証 |
| ARCH-01 | アーキテクチャ | 高 | AIエージェントの指示文が未実装 |
| ERR-01 | エラーハンドリング | 高 | 汎用的なエラーレスポンス |
| SEC-01 | セキュリティ | 中 | 環境変数の未検証アクセス |
| SEC-02 | セキュリティ | 中 | リダイレクトURLの未検証 |
| VAL-02 | 入力バリデーション | 中 | 文字列フィールドの最大長未設定 |
| ERR-02 | エラーハンドリング | 中 | エラーメッセージの文字列マッチング |
| ERR-03 | エラーハンドリング | 中 | サイレントなcatchブロック |
| TYPE-01 | 型安全性 | 中 | テストコードでの `any` 型使用 |
| DUP-01 | コード重複 | 中 | エラーハンドリングパターンの重複 |
| PERF-01 | パフォーマンス | 中 | ページネーション未実装 |
| PERF-02 | パフォーマンス | 中 | N+1クエリ問題 |
| PERF-03 | パフォーマンス | 中 | 競合状態 |
| TEST-01 | テスト | 中 | テストカバレッジ約28% |
| TEST-02 | テスト | 中 | エラーケースのテスト不足 |
| ARCH-02 | アーキテクチャ | 中 | APIルートの認証チェック不足 |
| DOC-01 | ドキュメント | 中 | API仕様書の未整備 |
| VAL-03 | 入力バリデーション | 低 | タイマー秒数の正数バリデーション未設定 |
| TYPE-02 | 型安全性 | 低 | JSON.parseの型安全性不足 |
| LOG-01 | ロギング | 低 | 構造化ロギングの未導入 |
| DOC-02 | ドキュメント | 低 | READMEの環境変数名の誤り |

### 対応優先度

**1. 最優先（即対応）:**
- VAL-01: ファイルアップロードのバリデーション追加
- ARCH-01: AIエージェント指示文の実装
- ARCH-02: APIルートの認証チェック追加

**2. 高優先（次スプリント）:**
- ERR-01 / ERR-02 / DUP-01: エラーハンドリングの統一・集約
- VAL-02: 全テキストフィールドの最大長設定
- SEC-01: 環境変数バリデーションの導入

**3. 中優先（定期メンテナンス）:**
- PERF-01 / PERF-02 / PERF-03: パフォーマンス改善
- TEST-01 / TEST-02: テストカバレッジの向上
- LOG-01: 構造化ロギングの導入

**4. 低優先:**
- DOC-01 / DOC-02: ドキュメント整備
- VAL-03 / TYPE-02: 軽微なバリデーション・型改善
