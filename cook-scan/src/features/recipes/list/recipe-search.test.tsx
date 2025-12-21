import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeSearch } from './recipe-search'

// Mock Next.js navigation hooks
const mockPush = vi.fn()
const mockSearchParams = new Map<string, string>()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams.get(key) || null,
    toString: () => {
      const params = new URLSearchParams()
      mockSearchParams.forEach((value, key) => {
        params.set(key, value)
      })
      return params.toString()
    },
  }),
}))

describe('RecipeSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParams.clear()
  })

  describe('初期レンダリング', () => {
    it('正常系：検索フォームが表示される', () => {
      // Given: 検索クエリがない状態
      // (mockSearchParamsは空)

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch />)

      // Then: 検索入力フィールドと検索ボタンが表示される
      expect(screen.getByPlaceholderText('レシピ名で検索...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument()
    })

    it('正常系：入力が空の場合、検索ボタンが無効化される', () => {
      // Given: 検索クエリがない状態
      // (mockSearchParamsは空)

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch />)

      // Then: 検索ボタンが無効化されている
      const searchButton = screen.getByRole('button', { name: '検索' })
      expect(searchButton).toBeDisabled()
    })

    it('正常系：URLパラメータから検索クエリを初期化する', () => {
      // Given: URLに検索クエリ「カレー」が含まれている
      mockSearchParams.set('q', 'カレー')

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch />)

      // Then: 検索入力フィールドに「カレー」が表示される
      const input = screen.getByPlaceholderText('レシピ名で検索...')
      expect(input).toHaveValue('カレー')
    })
  })

  describe('検索入力', () => {
    it('正常系：入力値が更新される', async () => {
      // Given: RecipeSearchコンポーネントがレンダリングされている
      const user = userEvent.setup()
      render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')

      // When: ユーザーが「パスタ」と入力する
      await user.type(input, 'パスタ')

      // Then: 入力フィールドに「パスタ」が表示される
      expect(input).toHaveValue('パスタ')
    })

    it('正常系：入力値がある場合、検索ボタンが有効化される', async () => {
      // Given: RecipeSearchコンポーネントがレンダリングされている
      const user = userEvent.setup()
      render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')
      const searchButton = screen.getByRole('button', { name: '検索' })

      // When: ユーザーが「ラーメン」と入力する
      await user.type(input, 'ラーメン')

      // Then: 検索ボタンが有効化される
      expect(searchButton).not.toBeDisabled()
    })

    it('異常系：空白のみの入力では検索ボタンが無効のまま', async () => {
      // Given: RecipeSearchコンポーネントがレンダリングされている
      const user = userEvent.setup()
      render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')
      const searchButton = screen.getByRole('button', { name: '検索' })

      // When: ユーザーが空白のみを入力する
      await user.type(input, '   ')

      // Then: 検索ボタンが無効のまま
      expect(searchButton).toBeDisabled()
    })
  })

  describe('検索実行', () => {
    it('正常系：検索ボタンクリックで検索クエリ付きのURLに遷移する', async () => {
      // Given: RecipeSearchコンポーネントがレンダリングされている
      const user = userEvent.setup()
      render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')

      // When: ユーザーが「うどん」と入力して検索ボタンをクリックする
      await user.type(input, 'うどん')
      await user.click(screen.getByRole('button', { name: '検索' }))

      // Then: 検索クエリ「うどん」を含むURLに遷移する
      expect(mockPush).toHaveBeenCalledWith('/recipes?q=%E3%81%86%E3%81%A9%E3%82%93')
    })

    it('正常系：前後の空白がトリムされる', async () => {
      // Given: RecipeSearchコンポーネントがレンダリングされている
      const user = userEvent.setup()
      render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')

      // When: ユーザーが前後に空白を含む「  そば  」と入力して検索する
      await user.type(input, '  そば  ')
      await user.click(screen.getByRole('button', { name: '検索' }))

      // Then: 空白がトリムされた「そば」で検索される
      expect(mockPush).toHaveBeenCalledWith('/recipes?q=%E3%81%9D%E3%81%B0')
    })

    it('正常系：他のURLパラメータが保持される', async () => {
      // Given: URLに「sort=date」パラメータが含まれている
      const user = userEvent.setup()
      mockSearchParams.set('sort', 'date')
      render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')

      // When: ユーザーが「パン」と入力して検索する
      await user.type(input, 'パン')
      await user.click(screen.getByRole('button', { name: '検索' }))

      // Then: sortパラメータが保持されたまま検索クエリが追加される
      expect(mockPush).toHaveBeenCalledWith('/recipes?sort=date&q=%E3%83%91%E3%83%B3')
    })

    it('正常系：Enterキーで検索が実行される', async () => {
      // Given: RecipeSearchコンポーネントがレンダリングされている
      const user = userEvent.setup()
      render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')

      // When: ユーザーが「ピザ」と入力してEnterキーを押す
      await user.type(input, 'ピザ{Enter}')

      // Then: 検索が実行される
      expect(mockPush).toHaveBeenCalledWith('/recipes?q=%E3%83%94%E3%82%B6')
    })
  })

  describe('検索クリア', () => {
    it('正常系：検索クエリがない場合、クリアボタンは表示されない', () => {
      // Given: 検索クエリがない状態
      // (mockSearchParamsは空)

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch />)

      // Then: クリアボタンは表示されない
      const clearButton = screen.queryByRole('button', { name: '検索をクリア' })
      expect(clearButton).not.toBeInTheDocument()
    })

    it('正常系：検索クエリがある場合、クリアボタンが表示される', () => {
      // Given: URLに検索クエリ「サラダ」が含まれている
      mockSearchParams.set('q', 'サラダ')

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch />)

      // Then: クリアボタンが表示される
      const clearButton = screen.getByRole('button', { name: '検索をクリア' })
      expect(clearButton).toBeInTheDocument()
    })

    it('正常系：クリアボタンをクリックすると検索がクリアされる', async () => {
      // Given: URLに検索クエリ「スープ」が含まれている
      const user = userEvent.setup()
      mockSearchParams.set('q', 'スープ')
      render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')

      // When: ユーザーがクリアボタンをクリックする
      const clearButton = screen.getByRole('button', { name: '検索をクリア' })
      await user.click(clearButton)

      // Then: 入力フィールドがクリアされ、検索パラメータなしのURLに遷移する
      expect(input).toHaveValue('')
      expect(mockPush).toHaveBeenCalledWith('/recipes?')
    })

    it('正常系：クリア時に他のURLパラメータは保持される', async () => {
      // Given: URLに検索クエリとカテゴリパラメータが含まれている
      const user = userEvent.setup()
      mockSearchParams.set('q', 'デザート')
      mockSearchParams.set('category', 'sweets')
      render(<RecipeSearch />)

      // When: ユーザーがクリアボタンをクリックする
      const clearButton = screen.getByRole('button', { name: '検索をクリア' })
      await user.click(clearButton)

      // Then: categoryパラメータが保持される
      expect(mockPush).toHaveBeenCalledWith('/recipes?category=sweets')
    })
  })

  describe('検索結果カウント', () => {
    it('正常系：検索クエリがない場合、結果カウントは表示されない', () => {
      // Given: 検索クエリがない状態でresultCountが5
      // (mockSearchParamsは空)

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch resultCount={5} />)

      // Then: 結果カウントは表示されない
      expect(screen.queryByText('検索結果:')).not.toBeInTheDocument()
    })

    it('正常系：resultCountが未定義の場合、結果カウントは表示されない', () => {
      // Given: resultCountが未定義で検索クエリ「和食」がある
      mockSearchParams.set('q', '和食')

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch />)

      // Then: 結果カウントは表示されない
      expect(screen.queryByText('検索結果:')).not.toBeInTheDocument()
    })

    it('正常系：検索クエリとresultCountがある場合、結果カウントが表示される', () => {
      // Given: 検索クエリ「中華」と結果数3がある
      mockSearchParams.set('q', '中華')

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch resultCount={3} />)

      // Then: 結果カウントが表示される
      expect(screen.getByText(/検索結果:/)).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('正常系：検索クエリが結果カウントに表示される', () => {
      // Given: 検索クエリ「イタリアン」と結果数7がある
      mockSearchParams.set('q', 'イタリアン')

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch resultCount={7} />)

      // Then: 検索クエリが結果カウントに表示される
      expect(screen.getByText('イタリアン')).toBeInTheDocument()
    })

    it('正常系：検索結果が0件の場合も正しく表示される', () => {
      // Given: 検索クエリ「フレンチ」と結果数0がある
      mockSearchParams.set('q', 'フレンチ')

      // When: RecipeSearchコンポーネントをレンダリングする
      render(<RecipeSearch resultCount={0} />)

      // Then: 結果数0が表示される
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('URL同期', () => {
    it('正常系：URLパラメータ変更時に入力フィールドが更新される', () => {
      // Given: 初期状態でRecipeSearchがレンダリングされている
      const { rerender } = render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')
      expect(input).toHaveValue('')

      // When: URLパラメータに「タイ料理」が設定されて再レンダリングされる
      mockSearchParams.set('q', 'タイ料理')
      rerender(<RecipeSearch />)

      // Then: 入力フィールドが「タイ料理」に更新される
      expect(input).toHaveValue('タイ料理')
    })

    it('正常系：空の検索では検索ボタンが無効化される', async () => {
      // Given: RecipeSearchコンポーネントがレンダリングされている
      const user = userEvent.setup()
      render(<RecipeSearch />)
      const input = screen.getByPlaceholderText('レシピ名で検索...')
      const searchButton = screen.getByRole('button', { name: '検索' })

      // When: ユーザーが「test」と入力して削除する
      await user.type(input, 'test')
      await user.clear(input)

      // Then: 検索ボタンが無効化される
      expect(searchButton).toBeDisabled()
    })
  })
})
