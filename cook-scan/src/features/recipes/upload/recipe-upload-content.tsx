'use client'

import { useState } from 'react'
import MethodSelector from '@/features/recipes/upload/method-selector'
import ImageUpload from '@/features/recipes/upload/image-upload'
import RecipeForm from '@/features/recipes/upload/recipe-form'
import type { ExtractedRecipeData } from '@/features/recipes/upload/types'
import type { RecipeFormTagCategory } from '@/features/recipes/types/tag'
import { Button } from '@/components/ui/button'
import { TextInput } from './text-input'
import { ChevronLeftIcon } from '@/components/icons'

type Step = 'method-selection' | 'image-upload' | 'text-input' | 'form'

type Props = {
  tagCategories: RecipeFormTagCategory[]
}

export default function RecipeUploadContent({ tagCategories }: Props) {
  const [currentStep, setCurrentStep] = useState<Step>('method-selection')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<ExtractedRecipeData | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const stepMap: Record<string, Step> = {
    scan: 'image-upload',
    'text-input': 'text-input',
    manual: 'form'
  }

  const handleMethodSelect = (method: 'scan' | 'manual' | 'text-input') => {
    setCurrentStep(stepMap[method])
  }

  const handleImageUpload = (imageUrl: string, extractedData: ExtractedRecipeData) => {
    setUploadedImageUrl(imageUrl)
    setExtractedData(extractedData)
    setCurrentStep('form')
  }

  const handleTextInput = (extractedData: ExtractedRecipeData) => {
    setExtractedData(extractedData)
    setCurrentStep('form')
  }

  const handleBack = () => {
    if (currentStep === 'form') {
      setCurrentStep(uploadedImageUrl ? 'image-upload' : 'method-selection')
    } else if (currentStep !== 'method-selection') {
      setCurrentStep('method-selection')
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
          <ChevronLeftIcon className="h-4 w-4" />
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

      {currentStep === 'text-input' && (
        <TextInput handleTextInput={handleTextInput} />
      )}

      {currentStep === 'form' && (
        <RecipeForm
          imageUrl={uploadedImageUrl}
          extractedData={extractedData}
          tagCategories={tagCategories}
        />
      )}
    </>
  )
}
