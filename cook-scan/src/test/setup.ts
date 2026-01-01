import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

// window.matchMedia のモック（jsdomには存在しないため）
// テスト環境ではデスクトップ版を表示するため、min-width: 640px は true を返す
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('min-width'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// 各テスト後に自動的にDOMをクリーンアップ
afterEach(() => {
  cleanup()
})
