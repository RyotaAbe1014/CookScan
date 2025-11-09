# テスト環境ガイド

このプロジェクトではVitestとReact Testing Libraryを使用したテスト環境が構築されています。

## セットアップ済みのツール

- **Vitest**: 高速なユニットテストフレームワーク
- **React Testing Library**: Reactコンポーネントのテスト
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション
- **vitest-mock-extended**: PrismaClientのモック

## テストコマンド

```bash
# すべてのテストを実行
npm test

# Watch モードでテストを実行（ファイル変更時に自動再実行）
npm run test:watch

# UIモードでテストを実行
npm run test:ui

# カバレッジレポートを生成
npm run test:coverage
```

## テストファイルの配置

テストファイルは、テスト対象のファイルと同じディレクトリに配置します：

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx          # コンポーネントのテスト
├── features/
│   └── recipes/
│       └── upload/
│           ├── actions.ts
│           └── actions.test.ts  # Server Actionsのテスト
└── utils/
    ├── format.ts
    └── format.test.ts           # ユーティリティ関数のテスト
```

## テストの種類と例

### 1. ユーティリティ関数のテスト

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from './format'

describe('formatDate', () => {
  it('should format a date correctly', () => {
    const date = new Date('2025-11-09')
    const result = formatDate(date)
    expect(result).toBeTruthy()
  })
})
```

### 2. Reactコンポーネントのテスト

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### 3. Server Actionsのテスト（Prismaモック使用）

```typescript
import { describe, it, expect, vi } from 'vitest'
import { createRecipe } from './actions'

// モックの設定
vi.mock('@/lib/prisma')
vi.mock('@/features/auth/auth-utils')

import { prisma } from '@/lib/prisma'
import { checkUserProfile } from '@/features/auth/auth-utils'

describe('createRecipe', () => {
  it('should create a recipe successfully', async () => {
    // モックの設定
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: true,
      hasProfile: true,
      profile: { id: 'user-123' } as any,
    })

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      const mockTx = {
        recipe: { create: vi.fn().mockResolvedValue({ id: 'recipe-456' }) },
        // ... 他のモック
      }
      return callback(mockTx)
    })

    const result = await createRecipe({ /* ... */ })

    expect(result.success).toBe(true)
  })
})
```

## Prismaのモック

Prismaクライアントは自動的にモックされます。テストでPrismaを使用する場合：

1. テストファイルで `vi.mock('@/lib/prisma')` を呼び出す
2. モックされた `prisma` をインポート
3. `vi.mocked(prisma.model.method)` でモックの挙動を設定

```typescript
import { prisma } from '@/lib/prisma'
import { vi } from 'vitest'

vi.mock('@/lib/prisma')

vi.mocked(prisma.recipe.findMany).mockResolvedValue([
  { id: '1', title: 'Test Recipe' },
])
```

## Next.jsモジュールのモック

`next/navigation` などのNext.jsモジュールは `vitest.setup.ts` で自動的にモックされています：

- `useRouter()`
- `usePathname()`
- `useSearchParams()`
- `redirect()`
- `notFound()`

テストで独自の挙動を設定したい場合：

```typescript
import { useRouter } from 'next/navigation'
import { vi } from 'vitest'

vi.mocked(useRouter).mockReturnValue({
  push: vi.fn(),
  replace: vi.fn(),
  // ...
})
```

## ベストプラクティス

1. **テストの独立性**: 各テストは独立して実行できるようにする
2. **モックのリセット**: `beforeEach` で `vi.clearAllMocks()` を呼び出す
3. **意味のあるテスト名**: テストが何を検証しているか明確にする
4. **AAA パターン**: Arrange（準備）、Act（実行）、Assert（検証）の順で書く
5. **ユーザー視点**: コンポーネントテストでは実装の詳細ではなく、ユーザーの視点でテストする

## テスト対象外

現在のVitestセットアップでは以下はテストできません（E2Eテストが必要）：

- 非同期Server Components
- 複雑なServer Actions（統合テスト）
- ブラウザ固有の動作
- 実際のデータベースとの統合

これらには **Playwright** などのE2Eテストフレームワークの使用を推奨します。

## トラブルシューティング

### テストが失敗する場合

1. `npm test -- --run` でテストを再実行
2. モックが正しく設定されているか確認
3. `vitest.setup.ts` の設定を確認

### カバレッジが取得できない場合

```bash
npm install -D @vitest/coverage-v8
npm run test:coverage
```

## 参考リンク

- [Vitest公式ドキュメント](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing: Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
