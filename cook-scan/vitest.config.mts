import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths(), // @/* パスエイリアス解決
    react(),
  ],
  test: {
    environment: 'jsdom',
    globals: true, // describe, it, expect等をグローバルに
    setupFiles: ['./src/test/setup.ts'], // グローバルセットアップ
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'coverage',
      '.claude/**', // .claudeディレクトリを除外
    ],
  },
})
