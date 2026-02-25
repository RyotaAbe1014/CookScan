'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { LinkIcon } from '@/components/icons/link-icon'
import { CheckIcon } from '@/components/icons/check-icon'
import { createShareLink, removeShareLink, getShareInfo } from './actions'
import { isSuccess } from '@/utils/result'

type Props = {
  recipeId: string
}

export function RecipeShareButton({ recipeId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchShareInfo = useCallback(async () => {
    const result = await getShareInfo(recipeId)
    if (isSuccess(result) && result.data && result.data.isActive) {
      setShareToken(result.data.shareToken)
      setIsActive(true)
    } else {
      setShareToken(null)
      setIsActive(false)
    }
  }, [recipeId])

  useEffect(() => {
    if (isOpen) {
      fetchShareInfo()
    }
  }, [isOpen, fetchShareInfo])

  const handleCreateShare = async () => {
    setIsLoading(true)
    try {
      const result = await createShareLink(recipeId)
      if (isSuccess(result)) {
        setShareToken(result.data.shareToken)
        setIsActive(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveShare = async () => {
    setIsLoading(true)
    try {
      const result = await removeShareLink(recipeId)
      if (isSuccess(result)) {
        setShareToken(null)
        setIsActive(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const shareUrl = shareToken ? `${window.location.origin}/shared/${shareToken}` : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="border border-gray-200"
      >
        <LinkIcon className="h-4 w-4" />
        共有
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>レシピを共有</DialogTitle>
            <DialogDescription>
              共有リンクを作成して、他の人にレシピを見せることができます。
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4">
            {isActive && shareToken ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        コピー済み
                      </>
                    ) : (
                      'コピー'
                    )}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="danger-ghost"
                  size="sm"
                  onClick={handleRemoveShare}
                  isLoading={isLoading}
                >
                  共有を停止
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleCreateShare}
                isLoading={isLoading}
              >
                <LinkIcon className="h-4 w-4" />
                共有リンクを作成
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
