import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeMemo } from '../recipe-memo'

describe('RecipeMemo', () => {
  describe('Given メモテキストが与えられた場合', () => {
    it('When コンポーネントをレンダリングする Then メモが表示される', () => {
      const memo = 'このレシピは夏にぴったりです。'

      render(<RecipeMemo memo={memo} />)

      expect(screen.getByText('メモ')).toBeInTheDocument()
      expect(screen.getByText(memo)).toBeInTheDocument()
    })

    it('When 複数行のメモをレンダリングする Then 改行が保持される', () => {
      const memo = '1行目\n2行目\n3行目'

      render(<RecipeMemo memo={memo} />)

      const memoElement = screen.getByText((content, element) => {
        return element?.tagName === 'P' && element?.textContent === memo
      })
      expect(memoElement).toBeInTheDocument()
      expect(memoElement).toHaveClass('whitespace-pre-wrap')
    })
  })

  describe('Given 空のメモが与えられた場合', () => {
    it('When コンポーネントをレンダリングする Then 空のメモが表示される', () => {
      render(<RecipeMemo memo="" />)

      expect(screen.getByText('メモ')).toBeInTheDocument()
      // 空文字列は表示されるが、内容は空
      const cardContent = screen.getByText('メモ').closest('div')?.parentElement
      expect(cardContent).toBeInTheDocument()
    })
  })
})
