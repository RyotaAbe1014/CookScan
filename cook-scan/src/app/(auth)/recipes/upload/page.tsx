'use client'

import { useState } from 'react'
import Link from 'next/link'
import MethodSelector from './method-selector'
import ImageUpload from './image-upload'
import RecipeForm from './recipe-form'
import type { ExtractedRecipeData } from './types'

type Step = 'method-selection' | 'image-upload' | 'form'

export default function RecipeUploadPage() {
  const [currentStep, setCurrentStep] = useState<Step>('method-selection')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<ExtractedRecipeData | null>(null)

  const handleMethodSelect = (method: 'scan' | 'manual') => {
    if (method === 'scan') {
      setCurrentStep('image-upload')
    } else {
      setCurrentStep('form')
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl)
    // TODO: OCR処理を実装
    // 現時点では空のフォームに遷移
    setCurrentStep('form')
  }

  const handleBack = () => {
    if (currentStep === 'image-upload') {
      setCurrentStep('method-selection')
    } else if (currentStep === 'form') {
      if (uploadedImageUrl) {
        setCurrentStep('image-upload')
      } else {
        setCurrentStep('method-selection')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                レシピをアップロード
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {currentStep === 'method-selection' && '入力方法を選択してください'}
                {currentStep === 'image-upload' && '画像をアップロードしてください'}
                {currentStep === 'form' && 'レシピ情報を入力してください'}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {currentStep !== 'method-selection' && (
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            戻る
          </button>
        )}

        {currentStep === 'method-selection' && (
          <MethodSelector onSelect={handleMethodSelect} />
        )}

        {currentStep === 'image-upload' && (
          <ImageUpload onUpload={handleImageUpload} />
        )}

        {currentStep === 'form' && (
          <RecipeForm
            imageUrl={uploadedImageUrl}
            extractedData={extractedData}
          />
        )}
      </main>
    </div>
  )
}