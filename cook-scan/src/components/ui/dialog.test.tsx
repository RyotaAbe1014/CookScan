import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog'

// Radix Dialog Portal をインラインレンダリングに変更
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual<typeof import('@radix-ui/react-dialog')>('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  }
})

describe('Dialog', () => {
  describe('表示制御', () => {
    it('open=trueの時、コンテンツが表示される', () => {
      render(
        <Dialog open={true}>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>タイトル</DialogTitle>
            <p>ダイアログの内容</p>
          </DialogContent>
        </Dialog>,
      )
      expect(screen.getByText('ダイアログの内容')).toBeInTheDocument()
    })

    it('open=falseの時、コンテンツが表示されない', () => {
      render(
        <Dialog open={false}>
          <DialogContent>
            <p>ダイアログの内容</p>
          </DialogContent>
        </Dialog>,
      )
      expect(screen.queryByText('ダイアログの内容')).not.toBeInTheDocument()
    })
  })

  describe('DialogHeader', () => {
    it('ヘッダーがborder-bクラスで表示される', () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>タイトル</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      )
      expect(screen.getByText('タイトル')).toBeInTheDocument()
      const header = container.querySelector('.border-b')
      expect(header).toBeInTheDocument()
    })

    it('カスタムclassNameが適用される', () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader className="bg-red-50">
              <DialogTitle>タイトル</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      )
      const header = container.querySelector('.bg-red-50')
      expect(header).toBeInTheDocument()
    })
  })

  describe('DialogTitle', () => {
    it('タイトルテキストが表示される', () => {
      render(
        <Dialog open={true}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>テストタイトル</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      )
      expect(screen.getByText('テストタイトル')).toBeInTheDocument()
    })
  })

  describe('DialogDescription', () => {
    it('説明テキストが表示される', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>タイトル</DialogTitle>
              <DialogDescription>説明テキスト</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      )
      expect(screen.getByText('説明テキスト')).toBeInTheDocument()
    })
  })

  describe('DialogFooter', () => {
    it('フッター内のボタンが表示される', () => {
      render(
        <Dialog open={true}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>タイトル</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <button>キャンセル</button>
              <button>確定</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
      )
      expect(screen.getByText('キャンセル')).toBeInTheDocument()
      expect(screen.getByText('確定')).toBeInTheDocument()
    })
  })

  describe('DialogContent', () => {
    it('デフォルトのmaxWidthが適用される', () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>タイトル</DialogTitle>
            <p>内容</p>
          </DialogContent>
        </Dialog>,
      )
      const content = container.querySelector('.max-w-lg')
      expect(content).toBeInTheDocument()
    })

    it('カスタムmaxWidthが適用される', () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent maxWidth="max-w-md" aria-describedby={undefined}>
            <DialogTitle>タイトル</DialogTitle>
            <p>内容</p>
          </DialogContent>
        </Dialog>,
      )
      const content = container.querySelector('.max-w-md')
      expect(content).toBeInTheDocument()
    })
  })

  describe('インタラクション', () => {
    it('ESCキーでonOpenChangeが呼ばれる', async () => {
      const onOpenChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>タイトル</DialogTitle>
            </DialogHeader>
            <p>内容</p>
          </DialogContent>
        </Dialog>,
      )

      await user.keyboard('{Escape}')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
