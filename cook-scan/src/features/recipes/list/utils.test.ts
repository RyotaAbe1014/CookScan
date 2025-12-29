import { describe, test, expect } from 'vitest'
import { parseRecipeSearchParams, buildTagFilters } from './utils'

describe('parseRecipeSearchParams', () => {
  test('正常系：タグと検索クエリが両方存在する場合', () => {
    // Given: タグIDと検索クエリを含むsearchParams
    const searchParams = {
      tag: ['tag1', 'tag2'],
      q: 'カレー',
    }

    // When: パース処理を実行する
    const result = parseRecipeSearchParams(searchParams)

    // Then: タグIDの配列と検索クエリが返される
    expect(result).toEqual({
      tagIds: ['tag1', 'tag2'],
      searchQuery: 'カレー',
    })
  })

  test('正常系：タグが単一の文字列の場合', () => {
    // Given: タグIDが単一の文字列
    const searchParams = {
      tag: 'tag1',
      q: 'パスタ',
    }

    // When: パース処理を実行する
    const result = parseRecipeSearchParams(searchParams)

    // Then: タグIDが配列に変換される
    expect(result).toEqual({
      tagIds: ['tag1'],
      searchQuery: 'パスタ',
    })
  })

  test('正常系：タグが存在しない場合', () => {
    // Given: タグなしのsearchParams
    const searchParams = {
      q: 'サラダ',
    }

    // When: パース処理を実行する
    const result = parseRecipeSearchParams(searchParams)

    // Then: 空のタグID配列が返される
    expect(result).toEqual({
      tagIds: [],
      searchQuery: 'サラダ',
    })
  })

  test('正常系：検索クエリが存在しない場合', () => {
    // Given: 検索クエリなしのsearchParams
    const searchParams = {
      tag: ['tag1', 'tag2'],
    }

    // When: パース処理を実行する
    const result = parseRecipeSearchParams(searchParams)

    // Then: 空の検索クエリが返される
    expect(result).toEqual({
      tagIds: ['tag1', 'tag2'],
      searchQuery: '',
    })
  })

  test('正常系：タグも検索クエリも存在しない場合', () => {
    // Given: 空のsearchParams
    const searchParams = {}

    // When: パース処理を実行する
    const result = parseRecipeSearchParams(searchParams)

    // Then: 空のタグIDと空の検索クエリが返される
    expect(result).toEqual({
      tagIds: [],
      searchQuery: '',
    })
  })

  test('正常系：検索クエリが空文字列の場合', () => {
    // Given: 空文字列の検索クエリ
    const searchParams = {
      q: '',
    }

    // When: パース処理を実行する
    const result = parseRecipeSearchParams(searchParams)

    // Then: 空の検索クエリが返される
    expect(result).toEqual({
      tagIds: [],
      searchQuery: '',
    })
  })

  test('正常系：検索クエリに前後の空白がある場合', () => {
    // Given: 前後に空白がある検索クエリ
    const searchParams = {
      q: '  カレー  ',
    }

    // When: パース処理を実行する
    const result = parseRecipeSearchParams(searchParams)

    // Then: 空白がトリムされた検索クエリが返される
    expect(result).toEqual({
      tagIds: [],
      searchQuery: 'カレー',
    })
  })

  test('正常系：検索クエリが空白のみの場合', () => {
    // Given: 空白のみの検索クエリ
    const searchParams = {
      q: '   ',
    }

    // When: パース処理を実行する
    const result = parseRecipeSearchParams(searchParams)

    // Then: 空の検索クエリが返される
    expect(result).toEqual({
      tagIds: [],
      searchQuery: '',
    })
  })

  test('正常系：タグが空配列の場合', () => {
    // Given: 空配列のタグ
    const searchParams = {
      tag: [],
    }

    // When: パース処理を実行する
    const result = parseRecipeSearchParams(searchParams)

    // Then: 空のタグID配列が返される
    expect(result).toEqual({
      tagIds: [],
      searchQuery: '',
    })
  })
})

describe('buildTagFilters', () => {
  test('正常系：複数のタグIDが渡された場合', () => {
    // Given: 複数のタグID
    const tagIds = ['tag1', 'tag2', 'tag3']

    // When: タグフィルターを構築する
    const result = buildTagFilters(tagIds)

    // Then: 各タグIDに対応するフィルター条件が生成される
    expect(result).toEqual([
      {
        recipeTags: {
          some: {
            tagId: 'tag1',
          },
        },
      },
      {
        recipeTags: {
          some: {
            tagId: 'tag2',
          },
        },
      },
      {
        recipeTags: {
          some: {
            tagId: 'tag3',
          },
        },
      },
    ])
  })

  test('正常系：単一のタグIDが渡された場合', () => {
    // Given: 単一のタグID
    const tagIds = ['tag1']

    // When: タグフィルターを構築する
    const result = buildTagFilters(tagIds)

    // Then: 単一のフィルター条件が生成される
    expect(result).toEqual([
      {
        recipeTags: {
          some: {
            tagId: 'tag1',
          },
        },
      },
    ])
  })

  test('正常系：空配列が渡された場合', () => {
    // Given: 空のタグID配列
    const tagIds: string[] = []

    // When: タグフィルターを構築する
    const result = buildTagFilters(tagIds)

    // Then: undefinedが返される
    expect(result).toBeUndefined()
  })
})
