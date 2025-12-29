import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { TagFilter } from './tag-filter'

// Next.js navigation のモック
const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}))

describe('TagFilter', () => {
  const mockTagCategories = [
    {
      id: 'cat1',
      name: 'カテゴリー1',
      tags: [
        { id: 'tag1', name: 'タグ1' },
        { id: 'tag2', name: 'タグ2' },
      ],
    },
    {
      id: 'cat2',
      name: 'カテゴリー2',
      tags: [
        { id: 'tag3', name: 'タグ3' },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParams.delete('tag')
  })

  test('正常系：タグカテゴリーとタグが表示される', () => {
    // Given: タグカテゴリーのデータ
    // When: TagFilterをレンダリングする
    render(<TagFilter tagCategories={mockTagCategories} />)

    // Then: カテゴリー名が表示される
    expect(screen.getByText('カテゴリー1')).toBeInTheDocument()
    expect(screen.getByText('カテゴリー2')).toBeInTheDocument()

    // Then: タグが表示される
    expect(screen.getByRole('button', { name: 'タグ1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'タグ2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'タグ3' })).toBeInTheDocument()
  })

  test('正常系：タグをクリックすると選択状態になる', async () => {
    // Given: タグフィルターとユーザーイベント
    const user = userEvent.setup()
    render(<TagFilter tagCategories={mockTagCategories} />)

    // When: タグをクリックする
    const tagButton = screen.getByRole('button', { name: 'タグ1' })
    await user.click(tagButton)

    // Then: router.pushが呼ばれる
    expect(mockPush).toHaveBeenCalledWith('/recipes?tag=tag1')
  })

  test('正常系：複数のタグを選択できる', async () => {
    // Given: タグフィルターとユーザーイベント
    const user = userEvent.setup()

    // 最初のタグを選択した状態をシミュレート
    mockSearchParams.set('tag', 'tag1')

    render(<TagFilter tagCategories={mockTagCategories} />)

    // When: 2つ目のタグをクリックする
    const tagButton = screen.getByRole('button', { name: 'タグ2' })
    await user.click(tagButton)

    // Then: router.pushが両方のタグを含むURLで呼ばれる
    expect(mockPush).toHaveBeenCalled()
    const pushCallArg = mockPush.mock.calls[0][0]
    expect(pushCallArg).toContain('tag=tag1')
    expect(pushCallArg).toContain('tag=tag2')
  })

  test('正常系：選択済みタグをクリックすると選択解除される', async () => {
    // Given: タグが選択済みの状態
    const user = userEvent.setup()
    mockSearchParams.append('tag', 'tag1')

    render(<TagFilter tagCategories={mockTagCategories} />)

    // When: 選択済みタグをクリックする
    const tagButton = screen.getByRole('button', { name: 'タグ1' })
    await user.click(tagButton)

    // Then: router.pushがタグなしのURLで呼ばれる
    expect(mockPush).toHaveBeenCalledWith('/recipes')
  })

  test('正常系：クリアボタンをクリックするとすべての選択が解除される', async () => {
    // Given: タグが選択済みの状態
    const user = userEvent.setup()
    mockSearchParams.append('tag', 'tag1')
    mockSearchParams.append('tag', 'tag2')

    render(<TagFilter tagCategories={mockTagCategories} />)

    // When: クリアボタンをクリックする
    const clearButton = screen.getByRole('button', { name: /クリア/i })
    await user.click(clearButton)

    // Then: router.pushがタグなしのURLで呼ばれる
    expect(mockPush).toHaveBeenCalledWith('/recipes')
  })

  test('正常系：タグが選択されていない場合、クリアボタンは表示されない', () => {
    // Given: タグが選択されていない状態
    // When: TagFilterをレンダリングする
    render(<TagFilter tagCategories={mockTagCategories} />)

    // Then: クリアボタンが表示されない
    expect(screen.queryByRole('button', { name: /クリア/i })).not.toBeInTheDocument()
  })

  test('正常系：選択済みタグにチェックマークが表示される', () => {
    // Given: タグが選択済みの状態
    mockSearchParams.append('tag', 'tag1')

    const { container } = render(<TagFilter tagCategories={mockTagCategories} />)

    // Then: 選択済みタグにチェックマークのSVGが表示される
    const tagButton = screen.getByRole('button', { name: 'タグ1' })
    const svg = tagButton.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  test('正常系：選択済みタグ数が表示される', () => {
    // Given: 2つのタグが選択済みの状態
    mockSearchParams.append('tag', 'tag1')
    mockSearchParams.append('tag', 'tag2')

    render(<TagFilter tagCategories={mockTagCategories} />)

    // Then: 選択済みタグ数が表示される
    expect(screen.getByText('2件のタグで絞り込み中')).toBeInTheDocument()
  })

  test('正常系：タグがないカテゴリーは表示されない', () => {
    // Given: タグのないカテゴリーを含むデータ
    const categoriesWithEmpty = [
      ...mockTagCategories,
      {
        id: 'cat3',
        name: '空のカテゴリー',
        tags: [],
      },
    ]

    // When: TagFilterをレンダリングする
    render(<TagFilter tagCategories={categoriesWithEmpty} />)

    // Then: タグのないカテゴリーは表示されない
    expect(screen.queryByText('空のカテゴリー')).not.toBeInTheDocument()
  })

  test('正常系：すべてのカテゴリーにタグがない場合、コンポーネント全体が表示されない', () => {
    // Given: すべてのカテゴリーにタグがない
    const emptyCategories = [
      {
        id: 'cat1',
        name: 'カテゴリー1',
        tags: [],
      },
    ]

    // When: TagFilterをレンダリングする
    const { container } = render(<TagFilter tagCategories={emptyCategories} />)

    // Then: コンポーネントが表示されない（nullを返す）
    expect(container.firstChild).toBeNull()
  })

  test('正常系：空のカテゴリー配列の場合、コンポーネント全体が表示されない', () => {
    // Given: 空のカテゴリー配列
    // When: TagFilterをレンダリングする
    const { container } = render(<TagFilter tagCategories={[]} />)

    // Then: コンポーネントが表示されない（nullを返す）
    expect(container.firstChild).toBeNull()
  })
})
