'use client'

import { useState } from 'react'
import MethodSelector from '@/features/recipes/upload/method-selector'
import ImageUpload from '@/features/recipes/upload/image-upload'
import RecipeForm from '@/features/recipes/upload/recipe-form'
import type { ExtractedRecipeData } from '@/features/recipes/upload/types'
import { Button } from '@/components/ui/button'

type Step = 'method-selection' | 'image-upload' | 'text-input' | 'form'

export default function RecipeUploadContent() {
  const [currentStep, setCurrentStep] = useState<Step>('method-selection')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<ExtractedRecipeData | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleMethodSelect = (method: 'scan' | 'manual' | 'text-input') => {
    switch (method) {
      case 'scan':
        setCurrentStep('image-upload')
        break
      case 'text-input':
        setCurrentStep('text-input')
        break
      default:
        setCurrentStep('form')
        break
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
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={isUploading}
          className="mb-6"
        >
          <svg
            className="h-4 w-4"
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
        </Button>
      )}

      {currentStep === 'method-selection' && (
        <MethodSelector onSelect={handleMethodSelect} />
      )}

      {currentStep === 'image-upload' && (
        <ImageUpload
          onUpload={handleImageUpload}
          onUploadingChange={setIsUploading}
        />
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
