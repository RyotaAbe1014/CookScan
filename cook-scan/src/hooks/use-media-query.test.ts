import { renderHook, act } from '@testing-library/react'
import { useMediaQuery, useIsMobile } from './use-media-query'
import { describe, test, expect, vi, beforeEach, afterEach, Mock } from 'vitest'

describe('useMediaQuery', () => {
  let matchMediaMock: Mock
  let listeners: Record<string, (event: MediaQueryListEvent) => void> = {}

  beforeEach(() => {
    listeners = {}

    matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn((event, callback) => {
        listeners[event] = callback
      }),
      removeEventListener: vi.fn((event) => {
        delete listeners[event]
      }),
      dispatchEvent: vi.fn(),
    }))

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('正常系：デフォルト値 (false) が返る', () => {
    // Given: メディアクエリがマッチしない状態（デフォルト）
    // (beforeEachで設定済み)

    // When: フックを実行する
    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'))

    // Then: falseが返る
    expect(result.current).toBe(false)
  })

  test('正常系：メディアクエリがマッチする場合にtrueが返る', () => {
    // Given: メディアクエリがマッチする状態
    matchMediaMock.mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    // When: フックを実行する
    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'))

    // Then: trueが返る
    expect(result.current).toBe(true)
  })

  test('正常系：メディアクエリの状態変化に応じて値が更新される', () => {
    // Given: 初期状態はマッチしない
    let matches = false

    matchMediaMock.mockImplementation((query) => ({
      get matches() { return matches },
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event, callback) => {
        listeners[event] = callback
      }),
      removeEventListener: vi.fn((event) => {
        delete listeners[event]
      }),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'))
    expect(result.current).toBe(false)

    // When: メディアクエリの状態が変化する
    act(() => {
      matches = true
      if (listeners['change']) {
        listeners['change']({ matches: true } as MediaQueryListEvent)
      }
    })

    // Then: 値がtrueに更新される
    expect(result.current).toBe(true)
  })
})

describe('useIsMobile', () => {
  let matchMediaMock: Mock

  beforeEach(() => {
    matchMediaMock = vi.fn()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('正常系：幅が640px未満の場合にtrueが返る', () => {
    // Given: 画面幅が640px未満の状態（min-width: 640px が false）
    matchMediaMock.mockReturnValue({
      matches: false, // Not desktop
      media: '(min-width: 640px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })

    // When: フックを実行する
    const { result } = renderHook(() => useIsMobile())

    // Then: モバイルと判定されtrueが返る
    expect(result.current).toBe(true)
  })

  test('正常系：幅が640px以上の場合にfalseが返る', () => {
    // Given: 画面幅が640px以上の状態（min-width: 640px が true）
    matchMediaMock.mockReturnValue({
      matches: true, // Is desktop
      media: '(min-width: 640px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })

    // When: フックを実行する
    const { result } = renderHook(() => useIsMobile())

    // Then: モバイルではないと判定されfalseが返る
    expect(result.current).toBe(false)
  })
})
