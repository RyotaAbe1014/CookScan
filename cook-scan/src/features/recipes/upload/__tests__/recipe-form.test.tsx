import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipeForm from '../recipe-form'

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />
}))

// Mock actions
const mockCreateRecipe = vi.fn()
const mockGetAllTagsForRecipe = vi.fn()

vi.mock('../actions', () => ({
  createRecipe: (...args: any[]) => mockCreateRecipe(...args)
}))

vi.mock('@/features/tags/actions', () => ({
  getAllTagsForRecipe: () => mockGetAllTagsForRecipe()
}))

describe('RecipeForm', () => {
  const mockExtractedData = {
    title: 'テストレシピ',
    sourceInfo: {
      bookName: 'テスト料理本',
      pageNumber: 'P.100',
      url: 'https://example.com'
    },
    ingredients: [
      { name: '材料1', unit: '100g', notes: 'メモ1' },
      { name: '材料2', unit: '200ml', notes: '' }
    ],
    steps: [
      { instruction: '手順1の説明', timerSeconds: 60 },
      { instruction: '手順2の説明', timerSeconds: undefined }
    ],
    memo: 'テストメモ',
    tags: []
  }

  const mockTagCategories = [
    {
      id: 'cat1',
      name: 'カテゴリ1',
      description: null,
      tags: [
        { id: 'tag1', name: 'タグ1', description: null },
        { id: 'tag2', name: 'タグ2', description: null }
      ]
    },
    {
      id: 'cat2',
      name: 'カテゴリ2',
      description: null,
      tags: [
        { id: 'tag3', name: 'タグ3', description: null }
      ]
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAllTagsForRecipe.mockResolvedValue(mockTagCategories)
  })

  it('renders form with extracted data', async () => {
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('テスト料理本')).toBeInTheDocument()
    expect(screen.getByDisplayValue('P.100')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('テストメモ')).toBeInTheDocument()
  })

  it('renders image preview when imageUrl is provided', () => {
    render(<RecipeForm imageUrl="test-image.jpg" extractedData={null} />)

    const image = screen.getByAltText('レシピ画像')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'test-image.jpg')
  })

  it('renders ingredients from extracted data', async () => {
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('100g')).toBeInTheDocument()
    expect(screen.getByDisplayValue('メモ1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('材料2')).toBeInTheDocument()
    expect(screen.getByDisplayValue('200ml')).toBeInTheDocument()
  })

  it('renders steps from extracted data', async () => {
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('手順1の説明')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('手順2の説明')).toBeInTheDocument()
    expect(screen.getByDisplayValue('60')).toBeInTheDocument()
  })

  it('loads and displays tag categories', async () => {
    render(<RecipeForm imageUrl={null} extractedData={null} />)

    await waitFor(() => {
      expect(screen.getByText('カテゴリ1')).toBeInTheDocument()
    })

    expect(screen.getByText('カテゴリ2')).toBeInTheDocument()
    expect(screen.getByText('タグ1')).toBeInTheDocument()
    expect(screen.getByText('タグ2')).toBeInTheDocument()
    expect(screen.getByText('タグ3')).toBeInTheDocument()
  })

  it('allows selecting and deselecting tags', async () => {
    const user = userEvent.setup()
    render(<RecipeForm imageUrl={null} extractedData={null} />)

    await waitFor(() => {
      expect(screen.getByText('タグ1')).toBeInTheDocument()
    })

    const tag1Label = screen.getByText('タグ1').closest('label')!
    const tag1Checkbox = tag1Label.querySelector('input[type="checkbox"]') as HTMLInputElement

    // Select tag
    await user.click(tag1Label)
    expect(tag1Checkbox).toBeChecked()

    // Deselect tag
    await user.click(tag1Label)
    expect(tag1Checkbox).not.toBeChecked()
  })

  it('allows adding new ingredient', async () => {
    const user = userEvent.setup()
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    const addButton = screen.getByRole('button', { name: /材料を追加/ })
    await user.click(addButton)

    const ingredientInputs = screen.getAllByPlaceholderText('材料名')
    expect(ingredientInputs).toHaveLength(3)
  })

  it('allows removing ingredient when more than one exists', async () => {
    const user = userEvent.setup()
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn =>
      btn.querySelector('svg path[d*="M19 7l"]')
    )

    await user.click(deleteButtons[0])

    expect(screen.queryByDisplayValue('材料1')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('材料2')).toBeInTheDocument()
  })

  it('disables ingredient remove button when only one ingredient exists', async () => {
    const singleIngredientData = {
      ...mockExtractedData,
      ingredients: [{ name: '材料1', unit: '100g', notes: '' }]
    }

    render(<RecipeForm imageUrl={null} extractedData={singleIngredientData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn =>
      btn.querySelector('svg path[d*="M19 7l"]')
    )

    const ingredientDeleteButton = deleteButtons.find(btn => !btn.disabled)
    expect(deleteButtons.some(btn => btn.disabled)).toBe(true)
  })

  it('allows adding new step', async () => {
    const user = userEvent.setup()
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('手順1の説明')).toBeInTheDocument()
    })

    const addButton = screen.getByRole('button', { name: /手順を追加/ })
    await user.click(addButton)

    const stepInputs = screen.getAllByPlaceholderText('手順の説明')
    expect(stepInputs).toHaveLength(3)
  })

  it('allows removing step when more than one exists', async () => {
    const user = userEvent.setup()
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('手順1の説明')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn =>
      btn.querySelector('svg path[d*="M19 7l"]')
    )

    // Find step delete buttons (there should be more delete buttons for both ingredients and steps)
    const stepDeleteButton = deleteButtons[deleteButtons.length - 2]
    await user.click(stepDeleteButton)

    expect(screen.queryByDisplayValue('手順1の説明')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('手順2の説明')).toBeInTheDocument()
  })

  it('updates ingredient field on user input', async () => {
    const user = userEvent.setup()
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    const ingredientInput = screen.getByDisplayValue('材料1')
    await user.clear(ingredientInput)
    await user.type(ingredientInput, '新しい材料')

    expect(screen.getByDisplayValue('新しい材料')).toBeInTheDocument()
  })

  it('updates step field on user input', async () => {
    const user = userEvent.setup()
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('手順1の説明')).toBeInTheDocument()
    })

    const stepInput = screen.getByDisplayValue('手順1の説明')
    await user.clear(stepInput)
    await user.type(stepInput, '新しい手順')

    expect(screen.getByDisplayValue('新しい手順')).toBeInTheDocument()
  })

  it('submits form with correct data and navigates on success', async () => {
    const user = userEvent.setup()
    mockCreateRecipe.mockResolvedValue({ success: true, recipeId: 'recipe-123' })

    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateRecipe).toHaveBeenCalledWith({
        title: 'テストレシピ',
        sourceInfo: {
          bookName: 'テスト料理本',
          pageNumber: 'P.100',
          url: 'https://example.com'
        },
        ingredients: mockExtractedData.ingredients,
        steps: mockExtractedData.steps,
        memo: 'テストメモ',
        tags: []
      })
    })

    expect(mockPush).toHaveBeenCalledWith('/recipes/recipe-123')
  })

  it('shows alert on submission error', async () => {
    const user = userEvent.setup()
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})
    mockCreateRecipe.mockResolvedValue({ success: false, error: '保存に失敗しました' })

    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('保存に失敗しました')
    })

    mockAlert.mockRestore()
  })

  it('disables submit button when title is empty', async () => {
    const user = userEvent.setup()
    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    const titleInput = screen.getByDisplayValue('テストレシピ')
    await user.clear(titleInput)

    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    expect(submitButton).toBeDisabled()
  })

  it('navigates to recipes page when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<RecipeForm imageUrl={null} extractedData={null} />)

    const cancelButton = screen.getByRole('button', { name: /キャンセル/ })
    await user.click(cancelButton)

    expect(mockPush).toHaveBeenCalledWith('/recipes')
  })

  it('submits form with null sourceInfo when all source fields are empty', async () => {
    const user = userEvent.setup()
    mockCreateRecipe.mockResolvedValue({ success: true, recipeId: 'recipe-123' })

    const dataWithoutSource = { ...mockExtractedData, sourceInfo: null }
    render(<RecipeForm imageUrl={null} extractedData={dataWithoutSource} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceInfo: null
        })
      )
    })
  })

  it('submits form with selected tags', async () => {
    const user = userEvent.setup()
    mockCreateRecipe.mockResolvedValue({ success: true, recipeId: 'recipe-123' })

    render(<RecipeForm imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByText('タグ1')).toBeInTheDocument()
    })

    // Select tags
    await user.click(screen.getByText('タグ1').closest('label')!)
    await user.click(screen.getByText('タグ3').closest('label')!)

    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: expect.arrayContaining(['tag1', 'tag3'])
        })
      )
    })
  })
})
