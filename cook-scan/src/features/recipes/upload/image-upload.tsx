'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { ExtractedRecipeData, ExtractResponse } from './types'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { CloudUploadIcon } from '@/components/icons/cloud-upload-icon'
import { ClipboardIcon } from '@/components/icons/clipboard-icon'
import { InfoCircleIcon } from '@/components/icons/info-circle-icon'
import { CloseIcon } from '@/components/icons/close-icon'
import { ReloadIcon } from '@/components/icons/reload-icon'
import { LightningBoltIcon } from '@/components/icons/lightning-bolt-icon'
import { PhotographIcon } from '@/components/icons/photograph-icon'

type Props = {
  onUpload: (imageUrl: string, extractedData: ExtractedRecipeData) => void
  onUploadingChange: (isUploading: boolean) => void
}

export default function ImageUpload({ onUpload, onUploadingChange }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<Array<{ file: File; preview: string }>>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const preview = selectedImages[0]?.preview ?? null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      void handleFiles(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      void handleFiles(files)
    }
  }

  const readFileAsDataUrl = useCallback((file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  }), [])

  const handleFiles = useCallback(async (
    files: FileList | File[],
    options?: { append?: boolean }
  ) => {
    setError(null)
    const fileList = Array.from(files)
    if (fileList.length === 0) return

    const invalidFile = fileList.find((file) => !file.type.startsWith('image/'))
    if (invalidFile) {
      setError('画像ファイルを選択してください')
      return
    }

    // HEIC/HEIF形式を除外
    const isHeic = fileList.some((file) => {
      const lowerFileName = file.name.toLowerCase()
      return file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        lowerFileName.endsWith('.heic') ||
        lowerFileName.endsWith('.heif')
    })

    if (isHeic) {
      setError('HEIC形式のファイルは対応していません。PNG、JPG、GIF形式の画像を選択してください')
      return
    }

    // ファイル数制限チェック
    const MAX_FILES = 5
    const currentCount = options?.append ? selectedImages.length : 0
    const totalCount = currentCount + fileList.length

    if (totalCount > MAX_FILES) {
      setError(`画像は最大${MAX_FILES}枚までです`)
      return
    }

    try {
      const previews = await Promise.all(fileList.map(readFileAsDataUrl))
      const nextImages = fileList.map((file, index) => ({
        file,
        preview: previews[index],
      }))
      setSelectedImages((current) => options?.append ? [...current, ...nextImages] : nextImages)
    } catch (error) {
      console.error(error)
      setError('画像の読み込みに失敗しました')
    }
  }, [readFileAsDataUrl, selectedImages.length])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          void handleFiles([file], { append: true })
        }
        break
      }
    }
  }, [handleFiles])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  const handleUpload = async () => {
    if (selectedImages.length === 0 || !preview) return

    setIsUploading(true)
    onUploadingChange(true)
    try {
      const formData = new FormData()
      selectedImages.forEach(({ file }) => {
        formData.append('file', file)
      })

      const res = await fetch('/recipes/extract/file', {
        method: 'POST',
        body: formData,
      })

      const data: ExtractResponse = await res.json().catch(() => ({ success: false, error: 'アップロードに失敗しました' }))

      if (!res.ok || data.success === false) {
        const msg = data.success === false ? data.error : 'アップロードに失敗しました'
        setError(msg)
        setIsUploading(false)
        onUploadingChange(false)
        return
      }
      onUpload(preview, data.result)
    } catch (e) {
      console.error(e)
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsUploading(false)
      onUploadingChange(false)
    }
  }

  const handleRemove = () => {
    setError(null)
    setSelectedImages([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-xl border-2 border-dashed p-12 text-center shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 ${isDragging
            ? 'border-emerald-500 bg-emerald-50 shadow-xl'
            : 'border-gray-300 bg-white hover:border-emerald-400 hover:shadow-xl'
            }`}
        >
          <div className="flex flex-col items-center">
            <div className={`rounded-xl p-4 transition-colors ${isDragging
              ? 'bg-emerald-600'
              : 'bg-linear-to-br from-emerald-100 to-teal-100'
              }`}>
              <CloudUploadIcon
                className={`h-16 w-16 transition-colors ${isDragging ? 'text-white' : 'text-emerald-600'
                  }`}
              />
            </div>
            <p className="mt-6 text-lg font-bold text-gray-900">
              画像をドラッグ&ドロップ
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-300" />
              <p className="text-sm text-gray-500">または</p>
              <div className="h-px flex-1 bg-gray-300" />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-gray-600">
              <ClipboardIcon className="h-4 w-4" />
              Ctrl+V で貼り付け
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="mt-6"
            >
              <PhotographIcon className="h-5 w-5" />
              ファイルを選択
            </Button>
            <div className="mt-6 space-y-3">
              <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <InfoCircleIcon className="h-3.5 w-3.5" />
                PNG、JPG、GIF形式（最大10MB）
              </p>
              <div className="rounded-lg bg-emerald-50/50 p-3 text-left ring-1 ring-emerald-100/50">
                <div className="flex gap-2">
                  <InfoCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-xs leading-relaxed text-emerald-800">
                    <span className="font-bold">ヒント:</span> 複数のファイルをアップロードする場合、レシピの続きに合わせて順番に設定すると、より正確に読み取ることができます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
          <div className="relative">
            <Image
              src={preview}
              alt="アップロードされた画像"
              width={800}
              height={384}
              unoptimized
              className="mx-auto max-h-96 rounded-xl object-contain shadow-md"
            />
            <button
              onClick={handleRemove}
              disabled={isUploading}
              className="absolute -right-2 -top-2 rounded-full bg-white p-2.5 shadow-lg ring-1 ring-gray-900/10 transition-all hover:bg-red-50 hover:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CloseIcon
                className="h-5 w-5 text-gray-600 hover:text-red-600"
              />
            </button>
          </div>
          {selectedImages.length > 1 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {selectedImages.slice(1).map((image, index) => (
                <div
                  key={`${image.file.name}-${image.file.size}-${image.file.lastModified}`}
                  className="overflow-hidden rounded-lg ring-1 ring-gray-900/5"
                >
                  <Image
                    src={image.preview}
                    alt={`追加画像 ${index + 2}`}
                    width={400}
                    height={240}
                    unoptimized
                    className="h-40 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <ReloadIcon className="h-4 w-4" />
              別の画像を選択
            </Button>
            <Button
              onClick={handleUpload}
              isLoading={isUploading}
            >
              {!isUploading && (
                <LightningBoltIcon className="h-4 w-4" />
              )}
              {isUploading ? '処理中...' : 'レシピを抽出'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
