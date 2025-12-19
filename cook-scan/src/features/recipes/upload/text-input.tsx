'use client'

import { useState } from "react"
import type { ExtractedRecipeData, ExtractResponse } from "./types"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

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
      const res = await fetch('/recipes/extract/text', {
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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">レシピテキスト</span>
            </div>
            {charCount > 0 && (
              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-all ${
                isValid
                  ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                  : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
              }`}>
                <span>{charCount}文字</span>
                {isValid ? (
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  あと{minChars - charCount}文字入力してください
                </p>
              )}
            </div>

            {/* ヘルプテキスト */}
            <div className="rounded-lg bg-linear-to-r from-indigo-50 to-purple-50 p-4 ring-1 ring-indigo-100">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-indigo-900">ヒント</h4>
                  <p className="mt-1 text-sm leading-relaxed text-indigo-700">
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
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
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