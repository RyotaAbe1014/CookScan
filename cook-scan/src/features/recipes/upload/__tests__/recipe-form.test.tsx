import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipeForm from '../recipe-form'
import type { CreateRecipeRequest } from '../types'

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock Next.js Image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />
}))

// Mock actions
const mockCreateRecipe = vi.fn()
const mockGetAllTagsForRecipe = vi.fn()

vi.mock('../actions', () => ({
  createRecipe: (...args: [CreateRecipeRequest]) => mockCreateRecipe(...args)
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

  it('正常系：抽出されたデータでフォームが表示される', async () => {
    // Given: 抽出されたデータが準備されている
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    // When: フォームが表示される
    // Then: 抽出されたデータがフォームに反映されている
    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('テスト料理本')).toBeInTheDocument()
    expect(screen.getByDisplayValue('P.100')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('テストメモ')).toBeInTheDocument()
  })

  it('正常系：imageUrlが提供された場合に画像プレビューが表示される', async () => {
    // Given: imageUrlが提供されている
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl="test-image.jpg" extractedData={null} />)

    // When: フォームが表示される
    // Then: 画像プレビューが表示される
    await waitFor(() => {
      const image = screen.getByAltText('レシピ画像')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'test-image.jpg')
    })
  })

  it('正常系：抽出されたデータから材料が表示される', async () => {
    // Given: 材料データが含まれた抽出データが準備されている
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    // When: フォームが表示される
    // Then: 材料が正しく表示される
    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('100g')).toBeInTheDocument()
    expect(screen.getByDisplayValue('メモ1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('材料2')).toBeInTheDocument()
    expect(screen.getByDisplayValue('200ml')).toBeInTheDocument()
  })

  it('正常系：抽出されたデータから手順が表示される', async () => {
    // Given: 手順データが含まれた抽出データが準備されている
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    // When: フォームが表示される
    // Then: 手順が正しく表示される
    await waitFor(() => {
      expect(screen.getByDisplayValue('手順1の説明')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('手順2の説明')).toBeInTheDocument()
    expect(screen.getByDisplayValue('60')).toBeInTheDocument()
  })

  it('正常系：タグカテゴリが読み込まれ表示される', async () => {
    // Given: タグカテゴリデータがモックされている
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={null} />)

    // When: フォームが表示される
    // Then: タグカテゴリとタグが表示される
    await waitFor(() => {
      expect(screen.getByText('カテゴリ1')).toBeInTheDocument()
    })

    expect(screen.getByText('カテゴリ2')).toBeInTheDocument()
    expect(screen.getByText('タグ1')).toBeInTheDocument()
    expect(screen.getByText('タグ2')).toBeInTheDocument()
    expect(screen.getByText('タグ3')).toBeInTheDocument()
  })

  it('正常系：タグを選択・解除できる', async () => {
    // Given: フォームが表示され、タグが読み込まれている
    const user = userEvent.setup()
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={null} />)

    await waitFor(() => {
      expect(screen.getByText('タグ1')).toBeInTheDocument()
    })

    const tag1Label = screen.getByText('タグ1').closest('label')!
    const tag1Checkbox = tag1Label.querySelector('input[type="checkbox"]') as HTMLInputElement

    // When: ユーザーがタグをクリックする
    await user.click(tag1Label)

    // Then: タグが選択される
    expect(tag1Checkbox).toBeChecked()

    // When: ユーザーが再度タグをクリックする
    await user.click(tag1Label)

    // Then: タグが解除される
    expect(tag1Checkbox).not.toBeChecked()
  })

  it('正常系：新しい材料を追加できる', async () => {
    // Given: フォームが表示され、既存の材料がある
    const user = userEvent.setup()
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    // When: ユーザーが「材料を追加」ボタンをクリックする
    const addButton = screen.getByRole('button', { name: /材料を追加/ })
    await user.click(addButton)

    // Then: 材料の入力欄が1つ増える
    const ingredientInputs = screen.getAllByPlaceholderText('材料名')
    expect(ingredientInputs).toHaveLength(3)
  })

  it('正常系：材料が2つ以上ある場合に材料を削除できる', async () => {
    // Given: フォームが表示され、材料が2つ以上ある
    const user = userEvent.setup()
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: '材料を削除' })

    // When: ユーザーが材料の削除ボタンをクリックする
    await user.click(deleteButtons[0])

    // Then: 材料が削除される
    expect(screen.queryByDisplayValue('材料1')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('材料2')).toBeInTheDocument()
  })

  it('異常系：材料が1つしかない場合、削除ボタンが無効化される', async () => {
    // Given: 材料が1つしかないデータが準備されている
    const singleIngredientData = {
      ...mockExtractedData,
      ingredients: [{ name: '材料1', unit: '100g', notes: '' }]
    }

    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={singleIngredientData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    // When: フォームが表示される
    // Then: 材料の削除ボタンが無効化されている
    const deleteButton = screen.getByRole('button', { name: '材料を削除' })
    expect(deleteButton).toBeDisabled()
  })

  it('正常系：新しい手順を追加できる', async () => {
    // Given: フォームが表示され、既存の手順がある
    const user = userEvent.setup()
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('手順1の説明')).toBeInTheDocument()
    })

    // When: ユーザーが「手順を追加」ボタンをクリックする
    const addButton = screen.getByRole('button', { name: /手順を追加/ })
    await user.click(addButton)

    // Then: 手順の入力欄が1つ増える
    const stepInputs = screen.getAllByPlaceholderText('手順の説明')
    expect(stepInputs).toHaveLength(3)
  })

  it('正常系：手順が2つ以上ある場合に手順を削除できる', async () => {
    // Given: フォームが表示され、手順が2つ以上ある
    const user = userEvent.setup()
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('手順1の説明')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: '手順を削除' })

    // When: ユーザーが最初の手順の削除ボタンをクリックする
    await user.click(deleteButtons[0])

    // Then: 手順が削除される
    expect(screen.queryByDisplayValue('手順1の説明')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('手順2の説明')).toBeInTheDocument()
  })

  it('正常系：ユーザー入力で材料フィールドが更新される', async () => {
    // Given: フォームが表示され、材料が入力されている
    const user = userEvent.setup()
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('材料1')).toBeInTheDocument()
    })

    // When: ユーザーが材料名を変更する
    const ingredientInput = screen.getByDisplayValue('材料1')
    await user.clear(ingredientInput)
    await user.type(ingredientInput, '新しい材料')

    // Then: 材料名が更新される
    expect(screen.getByDisplayValue('新しい材料')).toBeInTheDocument()
  })

  it('正常系：ユーザー入力で手順フィールドが更新される', async () => {
    // Given: フォームが表示され、手順が入力されている
    const user = userEvent.setup()
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('手順1の説明')).toBeInTheDocument()
    })

    // When: ユーザーが手順の説明を変更する
    const stepInput = screen.getByDisplayValue('手順1の説明')
    await user.clear(stepInput)
    await user.type(stepInput, '新しい手順')

    // Then: 手順の説明が更新される
    expect(screen.getByDisplayValue('新しい手順')).toBeInTheDocument()
  })

  it('正常系：正しいデータでフォームを送信し、成功時にナビゲートする', async () => {
    // Given: フォームが表示され、Server Actionが成功を返すようにモックされている
    const user = userEvent.setup()
    mockCreateRecipe.mockResolvedValue({ ok: true, data: { recipeId: 'recipe-123' } })

    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    // When: ユーザーが送信ボタンをクリックする
    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    await user.click(submitButton)

    // Then: Server Actionが正しいデータで呼ばれ、ナビゲートする
    await waitFor(() => {
      expect(mockCreateRecipe).toHaveBeenCalledWith(expect.objectContaining({
        title: 'テストレシピ',
        sourceInfo: {
          bookName: 'テスト料理本',
          pageNumber: 'P.100',
          url: 'https://example.com'
        },
        ingredients: expect.arrayContaining([
          expect.objectContaining({ name: '材料1', unit: '100g', notes: 'メモ1' }),
          expect.objectContaining({ name: '材料2', unit: '200ml', notes: '' }),
        ]),
        steps: expect.arrayContaining([
          expect.objectContaining({ instruction: '手順1の説明', timerSeconds: 60 }),
          expect.objectContaining({ instruction: '手順2の説明', timerSeconds: undefined }),
        ]),
        memo: 'テストメモ',
        tags: [],
        childRecipes: [],
      }))
    })

    expect(mockPush).toHaveBeenCalledWith('/recipes/recipe-123')
  })

  it('異常系：送信エラー時にアラートが表示される', async () => {
    // Given: フォームが表示され、Server Actionがエラーを返すようにモックされている
    const user = userEvent.setup()
    mockCreateRecipe.mockResolvedValue({ ok: false, error: { code: 'SERVER_ERROR', message: '保存に失敗しました' } })

    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    // When: ユーザーが送信ボタンをクリックする
    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    await user.click(submitButton)

    // Then: エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText('保存に失敗しました')).toBeInTheDocument()
    })
  })

  it('異常系：タイトルが空の場合、送信ボタンが無効化される', async () => {
    // Given: フォームが表示され、タイトルが入力されている
    const user = userEvent.setup()
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    // When: ユーザーがタイトルをクリアする
    const titleInput = screen.getByDisplayValue('テストレシピ')
    await user.clear(titleInput)

    // Then: 送信ボタンが無効化される
    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    expect(submitButton).toBeDisabled()
  })

  it('正常系：キャンセルボタンをクリックするとレシピ一覧ページにナビゲートする', async () => {
    // Given: フォームが表示されている
    const user = userEvent.setup()
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={null} />)

    // When: ユーザーがキャンセルボタンをクリックする
    const cancelButton = screen.getByRole('button', { name: /キャンセル/ })
    await user.click(cancelButton)

    // Then: レシピ一覧ページにナビゲートする
    expect(mockPush).toHaveBeenCalledWith('/recipes')
  })

  it('正常系：すべての出典フィールドが空の場合、sourceInfoがnullで送信される', async () => {
    // Given: フォームが表示され、出典情報がnullのデータが準備されている
    const user = userEvent.setup()
    mockCreateRecipe.mockResolvedValue({ ok: true, data: { recipeId: 'recipe-123' } })

    const dataWithoutSource = { ...mockExtractedData, sourceInfo: null }
    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={dataWithoutSource} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストレシピ')).toBeInTheDocument()
    })

    // When: ユーザーが送信ボタンをクリックする
    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    await user.click(submitButton)

    // Then: sourceInfoがnullで送信される
    await waitFor(() => {
      expect(mockCreateRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceInfo: null
        })
      )
    })
  })

  it('正常系：選択されたタグとともにフォームを送信する', async () => {
    // Given: フォームが表示され、タグが読み込まれている
    const user = userEvent.setup()
    mockCreateRecipe.mockResolvedValue({ ok: true, data: { recipeId: 'recipe-123' } })

    render(<RecipeForm tagCategories={mockTagCategories} imageUrl={null} extractedData={mockExtractedData} />)

    await waitFor(() => {
      expect(screen.getByText('タグ1')).toBeInTheDocument()
    })

    // When: ユーザーがタグを選択して送信する
    await user.click(screen.getByText('タグ1').closest('label')!)
    await user.click(screen.getByText('タグ3').closest('label')!)

    const submitButton = screen.getByRole('button', { name: /レシピを保存/ })
    await user.click(submitButton)

    // Then: 選択されたタグとともに送信される
    await waitFor(() => {
      expect(mockCreateRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: expect.arrayContaining(['tag1', 'tag3'])
        })
      )
    })
  })
})
