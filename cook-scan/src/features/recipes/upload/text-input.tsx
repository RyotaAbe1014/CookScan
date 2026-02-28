'use client'

import { useState } from "react"
import type { ExtractedRecipeData, ExtractResponse } from "./types"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { DocumentTextIcon } from '@/components/icons/document-text-icon'
import { CheckCircleSolidIcon } from '@/components/icons/check-circle-solid-icon'
import { ExclamationTriangleSolidIcon } from '@/components/icons/exclamation-triangle-solid-icon'
import { InfoCircleIcon } from '@/components/icons/info-circle-icon'
import { InfoSolidIcon } from '@/components/icons/info-solid-icon'
import { LightningBoltIcon } from '@/components/icons/lightning-bolt-icon'

type Props = {
  handleTextInput: (extractedData: ExtractedRecipeData) => void
}

export const TextInput = ({ handleTextInput }: Props) => {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (error) setError(null)
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('テキストを入力してください')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/recipes/extract/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      const data: ExtractResponse = await res.json().catch(() => ({
        success: false,
        error: 'アップロードに失敗しました'
      }))

      if (data.success) {
        handleTextInput(data.result)
        setText('')
      } else {
        setError(data.error)
      }
    } catch (e) {
      console.error(e)
      setError('ネットワークエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const charCount = text.length
  const minChars = 20
  const isValid = charCount >= minChars

  return (
    <div className="mx-auto max-w-2xl">
      {/* ヘッダー */}
      <div className="mb-6 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 shadow-md">
            <DocumentTextIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">テキストからレシピを作成</h2>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">
          レシピのテキストを貼り付けると、AIが自動で構造化されたレシピに変換します
        </p>
      </div>

      {/* メインカード */}
      <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
        {/* カードヘッダー（グラデーション背景） */}
        <div className="border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600">
                <DocumentTextIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">レシピテキスト</span>
            </div>
            {charCount > 0 && (
              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-all ${isValid
                  ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                  : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                }`}>
                <span>{charCount}文字</span>
                {isValid ? (
                  <CheckCircleSolidIcon className="h-3.5 w-3.5" />
                ) : (
                  <ExclamationTriangleSolidIcon className="h-3.5 w-3.5" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* カードボディ */}
        <div className="p-6">
          <div className="space-y-4">
            {/* テキストエリア */}
            <div>
              <Textarea
                value={text}
                onChange={handleChange}
                placeholder="レシピのテキストをここに貼り付けてください&#10;&#10;例：&#10;材料（2人分）&#10;- 鶏もも肉 300g&#10;- 玉ねぎ 1個&#10;- にんにく 2片&#10;&#10;作り方&#10;1. 鶏肉を一口大に切る&#10;2. フライパンで焼く..."
                rows={12}
                className="min-h-[300px] resize-y"
                disabled={isLoading}
              />
              {!isValid && charCount > 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                  <InfoCircleIcon className="h-3.5 w-3.5" />
                  あと{minChars - charCount}文字入力してください
                </p>
              )}
            </div>

            {/* ヘルプテキスト */}
            <div className="rounded-lg bg-linear-to-r from-emerald-50 to-teal-50 p-4 ring-1 ring-emerald-100">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <InfoSolidIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-emerald-900">ヒント</h4>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-700">
                    材料リストと調理手順が含まれたテキストを貼り付けてください。
                    書籍のレシピ、Webサイトからコピーしたテキスト、手書きメモの内容など、どんな形式でも構いません。
                  </p>
                </div>
              </div>
            </div>

            {/* エラー表示 */}
            {error && (
              <Alert variant="error">{error}</Alert>
            )}

            {/* アクションボタン */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !isValid}
                isLoading={isLoading}
                size="lg"
              >
                {!isLoading && (
                  <LightningBoltIcon className="h-5 w-5" />
                )}
                {isLoading ? '変換中...' : 'レシピを生成'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}