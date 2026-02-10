import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRecipeSearch } from '../use-recipe-search'

const mockSearchAvailableRecipes = vi.fn()

vi.mock('@/features/recipes/child-recipes/actions', () => ({
  searchAvailableRecipes: (...args: unknown[]) => mockSearchAvailableRecipes(...args),
}))

const mockRecipes = [
  { id: '1', title: 'レシピA', imageUrl: null },
  { id: '2', title: 'レシピB', imageUrl: 'https://example.com/img.png' },
]

describe('useRecipeSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchAvailableRecipes.mockResolvedValue({
      ok: true,
      data: mockRecipes,
    })
  })

  it('isOpenがtrueになると検索が実行される', async () => {
    const { result } = renderHook(() =>
      useRecipeSearch('parent-1', ['child-1'], true),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockSearchAvailableRecipes).toHaveBeenCalledWith(
      'parent-1',
      ['child-1'],
      undefined,
    )
    expect(result.current.recipes).toEqual(mockRecipes)
  })

  it('isOpenがfalseの場合は検索が実行されない', () => {
    renderHook(() => useRecipeSearch('parent-1', [], false))

    expect(mockSearchAvailableRecipes).not.toHaveBeenCalled()
  })

  it('handleSearchでクエリ付き検索ができる', async () => {
    const { result } = renderHook(() =>
      useRecipeSearch('parent-1', [], true),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    mockSearchAvailableRecipes.mockResolvedValue({
      ok: true,
      data: [mockRecipes[0]],
    })

    await act(async () => {
      await result.current.handleSearch('レシピA')
    })

    expect(mockSearchAvailableRecipes).toHaveBeenLastCalledWith(
      'parent-1',
      [],
      'レシピA',
    )
    expect(result.current.recipes).toEqual([mockRecipes[0]])
  })

  it('検索失敗時にエラーメッセージが設定される', async () => {
    mockSearchAvailableRecipes.mockResolvedValue({
      ok: false,
      error: { code: 'SERVER_ERROR', message: 'サーバーエラー' },
    })

    const { result } = renderHook(() =>
      useRecipeSearch('parent-1', [], true),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('サーバーエラー')
    expect(result.current.recipes).toEqual([])
  })

  it('例外発生時にフォールバックエラーメッセージが設定される', async () => {
    mockSearchAvailableRecipes.mockRejectedValue(new Error('network error'))

    const { result } = renderHook(() =>
      useRecipeSearch('parent-1', [], true),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('検索に失敗しました')
  })

  it('handleSearchKeyDownでEnterキーを押すと検索が実行される', async () => {
    const { result } = renderHook(() =>
      useRecipeSearch('parent-1', [], true),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    mockSearchAvailableRecipes.mockClear()

    act(() => {
      result.current.setSearchQuery('テスト')
    })

    // searchQueryの更新を反映するために再レンダリングを待つ
    // handleSearchKeyDownはsearchQueryをクロージャで参照するため、
    // rerender後に新しいhandlerを取得する必要がある
    await waitFor(() => {
      expect(result.current.searchQuery).toBe('テスト')
    })

    const preventDefault = vi.fn()
    await act(async () => {
      result.current.handleSearchKeyDown({
        key: 'Enter',
        preventDefault,
      } as unknown as React.KeyboardEvent)
    })

    expect(preventDefault).toHaveBeenCalled()
    expect(mockSearchAvailableRecipes).toHaveBeenCalledWith(
      'parent-1',
      [],
      'テスト',
    )
  })

  it('Enter以外のキーでは検索が実行されない', async () => {
    const { result } = renderHook(() =>
      useRecipeSearch('parent-1', [], true),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    mockSearchAvailableRecipes.mockClear()

    const preventDefault = vi.fn()
    act(() => {
      result.current.handleSearchKeyDown({
        key: 'a',
        preventDefault,
      } as unknown as React.KeyboardEvent)
    })

    expect(preventDefault).not.toHaveBeenCalled()
    expect(mockSearchAvailableRecipes).not.toHaveBeenCalled()
  })

  it('resetで検索クエリとエラーがクリアされる', async () => {
    mockSearchAvailableRecipes.mockResolvedValue({
      ok: false,
      error: { code: 'SERVER_ERROR', message: 'エラー' },
    })

    const { result } = renderHook(() =>
      useRecipeSearch('parent-1', [], true),
    )

    await waitFor(() => {
      expect(result.current.error).toBe('エラー')
    })

    act(() => {
      result.current.setSearchQuery('何か')
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.searchQuery).toBe('')
    expect(result.current.error).toBeNull()
  })

  it('空文字のqueryはundefinedとして渡される', async () => {
    const { result } = renderHook(() =>
      useRecipeSearch('parent-1', [], true),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    mockSearchAvailableRecipes.mockClear()

    await act(async () => {
      await result.current.handleSearch('')
    })

    expect(mockSearchAvailableRecipes).toHaveBeenCalledWith(
      'parent-1',
      [],
      undefined,
    )
  })
})
