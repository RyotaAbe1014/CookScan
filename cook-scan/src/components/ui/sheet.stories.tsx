import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import Link from 'next/link'
import { Sheet } from './sheet'
import { Button } from './button'
import { CloseIcon } from '@/components/icons/close-icon'

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => { },
    children: null,
  },
  render: function SheetStory() {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>シートを開く</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">メニュー</h2>
              <button onClick={() => setIsOpen(false)}>
                <CloseIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 p-4">
              <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                ダッシュボード
              </Link>
              <Link href="/recipes" className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                レシピ一覧
              </Link>
              <Link href="/tags" className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                タグ管理
              </Link>
              <Link href="/settings/profile" className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                設定
              </Link>
            </nav>
          </div>
        </Sheet>
      </div>
    )
  },
}

export const AlwaysOpen: Story = {
  args: {
    isOpen: true,
    onClose: () => { },
    children: (
      <div className="p-6">
        <h2 className="text-lg font-semibold">シートコンテンツ</h2>
        <p className="mt-2 text-sm text-gray-600">
          ここにコンテンツが入ります。
        </p>
      </div>
    ),
  },
}
