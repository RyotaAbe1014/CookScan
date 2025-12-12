import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// 各テスト後に自動的にDOMをクリーンアップ
afterEach(() => {
  cleanup()
})
