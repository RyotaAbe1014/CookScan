'use client'

import { useState } from 'react'
import MethodSelector from '@/features/recipes/upload/method-selector'
import ImageUpload from '@/features/recipes/upload/image-upload'
import RecipeForm from '@/features/recipes/upload/recipe-form'
import type { ExtractedRecipeData } from '@/features/recipes/upload/types'

type Step = 'method-selection' | 'image-upload' | 'form'

export default function RecipeUploadContent() {
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

  const handleImageUpload = (imageUrl: string, extractedData: ExtractedRecipeData) => {
    setUploadedImageUrl(imageUrl)
    setExtractedData(extractedData)
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
    <>
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
    </>
  )
}
