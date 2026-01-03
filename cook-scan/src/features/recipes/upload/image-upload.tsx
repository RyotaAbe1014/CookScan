'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { ExtractedRecipeData, ExtractResponse } from './types'
import { Button } from '@/components/ui/button'

type Props = {
  onUpload: (imageUrl: string, extractedData: ExtractedRecipeData) => void
  onUploadingChange: (isUploading: boolean) => void
}

export default function ImageUpload({ onUpload, onUploadingChange }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    // HEIC/HEIF形式を除外
    const lowerFileName = file.name.toLowerCase()
    const isHeic = file.type === 'image/heic' ||
                   file.type === 'image/heif' ||
                   lowerFileName.endsWith('.heic') ||
                   lowerFileName.endsWith('.heif')

    if (isHeic) {
      alert('HEIC形式のファイルは対応していません。PNG、JPG、GIF形式の画像を選択してください')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          handleFile(file)
        }
        break
      }
    }
  }, [handleFile])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  const handleUpload = async () => {
    if (!selectedFile || !preview) return

    setIsUploading(true)
    onUploadingChange(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/recipes/extract/file', {
        method: 'POST',
        body: formData,
      })

      const data: ExtractResponse = await res.json().catch(() => ({ success: false, error: 'アップロードに失敗しました' }))

      if (!res.ok || data.success === false) {
        const msg = data.success === false ? data.error : 'アップロードに失敗しました'
        alert(msg)
        setIsUploading(false)
        onUploadingChange(false)
        return
      }
      onUpload(preview, data.result)
    } catch (e) {
      console.error(e)
      alert('ネットワークエラーが発生しました')
    } finally {
      setIsUploading(false)
      onUploadingChange(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-xl border-2 border-dashed p-12 text-center shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 ${isDragging
            ? 'border-indigo-500 bg-linear-to-br from-indigo-50 to-purple-50 shadow-xl'
            : 'border-gray-300 bg-white hover:border-indigo-400 hover:shadow-xl'
            }`}
        >
          <div className="flex flex-col items-center">
            <div className={`rounded-xl p-4 transition-colors ${isDragging
                ? 'bg-linear-to-br from-indigo-500 to-purple-600'
                : 'bg-linear-to-br from-indigo-100 to-purple-100'
              }`}>
              <svg
                className={`h-16 w-16 transition-colors ${isDragging ? 'text-white' : 'text-indigo-600'
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
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
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Ctrl+V で貼り付け
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="mt-6"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ファイルを選択
            </Button>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              PNG、JPG、GIF形式（最大10MB）
            </p>
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
              <svg
                className="h-5 w-5 text-gray-600 hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              別の画像を選択
            </Button>
            <Button
              onClick={handleUpload}
              isLoading={isUploading}
            >
              {!isUploading && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              {isUploading ? '処理中...' : 'レシピを抽出'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
