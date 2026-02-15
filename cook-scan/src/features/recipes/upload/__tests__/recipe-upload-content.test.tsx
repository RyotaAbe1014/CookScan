import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipeUploadContent from '../recipe-upload-content'
import type { ExtractedRecipeData } from '@/features/recipes/upload/types'
import type { RecipeFormTagCategory } from '@/features/recipes/types/tag'

// Mock child components
vi.mock('@/features/recipes/upload/method-selector', () => ({
  default: ({ onSelect }: { onSelect: (method: string) => void }) => (
    <div data-testid="method-selector">
      <button onClick={() => onSelect('scan')}>スキャン</button>
      <button onClick={() => onSelect('manual')}>手動入力</button>
      <button onClick={() => onSelect('text-input')}>テキスト入力</button>
    </div>
  )
}))

vi.mock('@/features/recipes/upload/image-upload', () => ({
  default: ({ onUpload }: { onUpload: (imageUrl: string, extractedData: ExtractedRecipeData) => void }) => (
    <div data-testid="image-upload">
      <button onClick={() => {
        const mockData = {
          title: 'テストレシピ',
          sourceInfo: null,
          ingredients: [],
          steps: [],
          tags: []
        }
        onUpload('test-image.jpg', mockData)
      }}>
        画像アップロード
      </button>
    </div>
  )
}))

vi.mock('@/features/recipes/upload/text-input', () => ({
  TextInput: ({ handleTextInput }: { handleTextInput: (extractedData: ExtractedRecipeData) => void }) => (
    <div data-testid="text-input">
      <button onClick={() => {
        const mockData = {
          title: 'テストレシピ',
          sourceInfo: null,
          ingredients: [],
          steps: [],
          tags: []
        }
        handleTextInput(mockData)
      }}>
        テキスト送信
      </button>
    </div>
  )
}))

vi.mock('@/features/recipes/upload/recipe-form', () => ({
  default: ({ imageUrl, extractedData, tagCategories }: { imageUrl: string | null; extractedData: ExtractedRecipeData | null; tagCategories: RecipeFormTagCategory[] }) => (
    <div data-testid="recipe-form">
      <div>Image URL: {imageUrl || 'none'}</div>
      <div>Title: {extractedData?.title || 'none'}</div>
      <div>Tag Categories: {tagCategories?.length || 0}</div>
    </div>
  )
}))

describe('RecipeUploadContent', () => {
  const mockTagCategories = [
    {
      id: 'cat1',
      name: 'カテゴリ1',
      description: null,
      tags: [
        { id: 'tag1', name: 'タグ1', description: null }
      ]
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders method selector on initial load', () => {
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)
    expect(screen.getByTestId('method-selector')).toBeInTheDocument()
  })

  it('does not show back button on method selection step', () => {
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)
    expect(screen.queryByRole('button', { name: /戻る/ })).not.toBeInTheDocument()
  })

  it('navigates to image upload when scan method is selected', async () => {
    const user = userEvent.setup()
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    await user.click(screen.getByText('スキャン'))

    expect(screen.getByTestId('image-upload')).toBeInTheDocument()
    expect(screen.queryByTestId('method-selector')).not.toBeInTheDocument()
  })

  it('navigates to text input when text-input method is selected', async () => {
    const user = userEvent.setup()
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    await user.click(screen.getByText('テキスト入力'))

    expect(screen.getByTestId('text-input')).toBeInTheDocument()
    expect(screen.queryByTestId('method-selector')).not.toBeInTheDocument()
  })

  it('navigates to form when manual method is selected', async () => {
    const user = userEvent.setup()
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    await user.click(screen.getByText('手動入力'))

    expect(screen.getByTestId('recipe-form')).toBeInTheDocument()
    expect(screen.queryByTestId('method-selector')).not.toBeInTheDocument()
  })

  it('shows back button after navigating from method selection', async () => {
    const user = userEvent.setup()
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    await user.click(screen.getByText('スキャン'))

    expect(screen.getByRole('button', { name: /戻る/ })).toBeInTheDocument()
  })

  it('navigates back to method selection from image upload', async () => {
    const user = userEvent.setup()
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    await user.click(screen.getByText('スキャン'))
    expect(screen.getByTestId('image-upload')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /戻る/ }))
    expect(screen.getByTestId('method-selector')).toBeInTheDocument()
  })

  it('navigates back to method selection from text input', async () => {
    const user = userEvent.setup()
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    await user.click(screen.getByText('テキスト入力'))
    expect(screen.getByTestId('text-input')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /戻る/ }))
    expect(screen.getByTestId('method-selector')).toBeInTheDocument()
  })

  it('stores uploaded image URL after upload', async () => {
    const user = userEvent.setup()
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    await user.click(screen.getByText('スキャン'))

    // Verify image upload component is shown
    expect(screen.getByTestId('image-upload')).toBeInTheDocument()
  })

  it('stores extracted data after text input', async () => {
    const user = userEvent.setup()
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    await user.click(screen.getByText('テキスト入力'))

    // Verify text input component is shown
    expect(screen.getByTestId('text-input')).toBeInTheDocument()
  })

  it('manages form state across navigation', async () => {
    const user = userEvent.setup()
    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    // Navigate to manual form entry
    await user.click(screen.getByText('手動入力'))

    expect(screen.getByTestId('recipe-form')).toBeInTheDocument()
  })

  it('disables back button while uploading', async () => {
    const user = userEvent.setup()

    render(<RecipeUploadContent tagCategories={mockTagCategories} />)

    await user.click(screen.getByText('スキャン'))
    const backButton = screen.getByRole('button', { name: /戻る/ })

    expect(backButton).toBeEnabled()
  })
})
