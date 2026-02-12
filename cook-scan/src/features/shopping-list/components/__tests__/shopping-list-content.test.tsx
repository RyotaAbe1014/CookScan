import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ShoppingListContent } from '../shopping-list-content'
import type { ShoppingItemOutput } from '@/backend/domain/shopping-items'

// モック: Server Actions
vi.mock('@/features/shopping-list/actions', () => ({
  updateShoppingItemCheck: vi.fn(),
  deleteShoppingItem: vi.fn(),
  deleteCheckedItems: vi.fn(),
}))

// Radix Dialog Portal をインラインレンダリングに変更
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual<typeof import('@radix-ui/react-dialog')>('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  }
})

describe('ShoppingListContent', () => {
  const mockItems: ShoppingItemOutput[] = [
    {
      id: 'item-1',
      userId: 'user-1',
      name: '牛乳',
      memo: null,
      isChecked: false,
      displayOrder: 0,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'item-2',
      userId: 'user-1',
      name: '卵',
      memo: '10個入り',
      isChecked: false,
      displayOrder: 1,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 'item-3',
      userId: 'user-1',
      name: 'バター',
      memo: null,
      isChecked: true,
      displayOrder: 2,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('表示', () => {
    it('アイテムがある場合、全アイテムが表示される', () => {
      // Given: 3件のアイテム（未チェック2件、チェック済み1件）
      // When: レンダリングする
      render(<ShoppingListContent items={mockItems} />)

      // Then: 全アイテムが表示される
      expect(screen.getByText('牛乳')).toBeInTheDocument()
      expect(screen.getByText('卵')).toBeInTheDocument()
      expect(screen.getByText('バター')).toBeInTheDocument()
    })

    it('アイテムが空の場合、空状態が表示される', () => {
      // Given: 空のアイテム配列
      // When: レンダリングする
      render(<ShoppingListContent items={[]} />)

      // Then: 空状態が表示される
      expect(screen.getByText('買い物リストは空です')).toBeInTheDocument()
    })

    it('チェック済みアイテムがある場合、購入済みセクションが表示される', () => {
      // Given: チェック済みアイテムを含むリスト
      // When: レンダリングする
      render(<ShoppingListContent items={mockItems} />)

      // Then: 購入済みセクションが表示される
      expect(screen.getByText('購入済み (1)')).toBeInTheDocument()
    })

    it('チェック済みアイテムがない場合、購入済みセクションが表示されない', () => {
      // Given: 全て未チェックのアイテム
      const uncheckedOnly = mockItems.filter((item) => !item.isChecked)

      // When: レンダリングする
      render(<ShoppingListContent items={uncheckedOnly} />)

      // Then: 購入済みセクションが表示されない
      expect(screen.queryByText(/購入済み/)).not.toBeInTheDocument()
    })

    it('チェック済みアイテムがある場合、一括削除ボタンが表示される', () => {
      // Given: チェック済みアイテムを含むリスト
      // When: レンダリングする
      render(<ShoppingListContent items={mockItems} />)

      // Then: 一括削除ボタンが表示される
      expect(screen.getByRole('button', { name: /一括削除/ })).toBeInTheDocument()
    })

    it('メモ付きアイテムのメモが表示される', () => {
      // Given: メモ付きアイテムを含むリスト
      // When: レンダリングする
      render(<ShoppingListContent items={mockItems} />)

      // Then: メモが表示される
      expect(screen.getByText('10個入り')).toBeInTheDocument()
    })
  })

  describe('統計バー', () => {
    it('合計件数が表示される', () => {
      // Given: 3件のアイテム
      // When: レンダリングする
      render(<ShoppingListContent items={mockItems} />)

      // Then: 合計件数が表示される
      expect(screen.getByText('3件')).toBeInTheDocument()
    })

    it('チェック済み件数が購入済みとして表示される', () => {
      // Given: 1件がチェック済み
      // When: レンダリングする
      render(<ShoppingListContent items={mockItems} />)

      // Then: 購入済み件数が表示される
      expect(screen.getByText('1件 購入済み')).toBeInTheDocument()
    })
  })
})
