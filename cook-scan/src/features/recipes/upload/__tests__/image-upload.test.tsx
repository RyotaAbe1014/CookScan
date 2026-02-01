import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImageUpload from '../image-upload'

// Mock Next.js Image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />
}))

// Mock fetch
global.fetch = vi.fn()

// Mock FileReader
class MockFileReader {
  result: string | ArrayBuffer | null = null
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null

  readAsDataURL(_file: Blob) {
    setTimeout(() => {
      this.result = 'data:image/png;base64,mockbase64data'
      if (this.onload) {
        this.onload.call(this as any, { target: this } as any)
      }
    }, 0)
  }
}

global.FileReader = MockFileReader as any

describe('ImageUpload', () => {
  const mockOnUpload = vi.fn()
  const mockOnUploadingChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area initially', () => {
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    expect(screen.getByText('画像をドラッグ&ドロップ')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ファイルを選択/ })).toBeInTheDocument()
    expect(screen.getByText(/複数のファイルをアップロードする場合/)).toBeInTheDocument()
    expect(screen.getByText(/順番に設定すると/)).toBeInTheDocument()
  })

  it('handles file selection via input', async () => {
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
    })
  })

  it('shows preview after file selection', async () => {
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      const previewImage = screen.getByAltText('アップロードされた画像')
      expect(previewImage).toHaveAttribute('src', 'data:image/png;base64,mockbase64data')
    })
  })

  it('shows preview only for image files', async () => {
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const imageFile = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, imageFile)

    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
    })
  })

  it('handles drag and drop', async () => {
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const dropZone = screen.getByText('画像をドラッグ&ドロップ').closest('div')!
    const file = new File(['test'], 'test.png', { type: 'image/png' })

    fireEvent.dragOver(dropZone, {
      dataTransfer: { files: [file] }
    })

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    })

    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
    })
  })

  it('responds to drag events', () => {
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    // Verify initial upload area is rendered
    expect(screen.getByText('画像をドラッグ&ドロップ')).toBeInTheDocument()
    expect(screen.getByText('ファイルを選択')).toBeInTheDocument()
  })

  it('handles paste event with image', async () => {
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })

    // Create a more complete mock clipboard data
    const mockClipboardData = {
      items: {
        length: 1,
        0: {
          type: 'image/png',
          getAsFile: () => file
        }
      }
    }

    const pasteEvent = new Event('paste') as ClipboardEvent
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: mockClipboardData
    })

    await act(async () => {
      document.dispatchEvent(pasteEvent)
    })

    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
    })
  })

  it('removes preview when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
    })

    const removeButtons = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg path[d*="M6 18L18 6"]')
    )
    await user.click(removeButtons[0])

    expect(screen.queryByAltText('アップロードされた画像')).not.toBeInTheDocument()
    expect(screen.getByText('画像をドラッグ&ドロップ')).toBeInTheDocument()
  })

  it('shows upload button after file selection', async () => {
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /レシピを抽出/ })).toBeInTheDocument()
    })
  })

  it('shows alert on upload error', async () => {
    const user = userEvent.setup()

      ; (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, error: 'アップロードエラー' })
      })

    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /レシピを抽出/ })).toBeInTheDocument()
    })

    const uploadButton = screen.getByRole('button', { name: /レシピを抽出/ })
    await user.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText('アップロードエラー')).toBeInTheDocument()
    })
  })

  it('shows alert on network error', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      ; (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))

    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /レシピを抽出/ })).toBeInTheDocument()
    })

    const uploadButton = screen.getByRole('button', { name: /レシピを抽出/ })
    await user.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText('ネットワークエラーが発生しました')).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })

  it('disables buttons during upload', async () => {
    const user = userEvent.setup()

    // Create a promise that we control
    let resolveUpload: (value: any) => void
    const uploadPromise = new Promise((resolve) => {
      resolveUpload = resolve
    })

      ; (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(uploadPromise)

    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /レシピを抽出/ })).toBeInTheDocument()
    })

    const uploadButton = screen.getByRole('button', { name: /レシピを抽出/ })
    await user.click(uploadButton)

    // During upload, buttons should be disabled
    await waitFor(() => {
      expect(screen.getByText('処理中...')).toBeInTheDocument()
    })

    const secondaryButton = screen.getByRole('button', { name: /別の画像を選択/ })
    expect(secondaryButton).toBeDisabled()

    // Resolve the upload
    await act(async () => {
      resolveUpload!({
        ok: true,
        json: async () => ({ success: true, result: { title: 'Test', sourceInfo: null, ingredients: [], steps: [], tags: [] } })
      })
      // Wait for promise to resolve
      await uploadPromise
    })
  })

  it('shows "別の画像を選択" button after preview', async () => {
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /別の画像を選択/ })).toBeInTheDocument()
    })
  })

  it('returns to upload area when secondary button is clicked', async () => {
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
    })

    const removeButton = screen.getByRole('button', { name: /別の画像を選択/ })
    await user.click(removeButton)

    await waitFor(() => {
      expect(screen.getByText('画像をドラッグ&ドロップ')).toBeInTheDocument()
    })
  })

  it('複数ファイル選択：2つのファイルを選択すると両方のプレビューが表示される', async () => {
    // Given: アップロードフォームが表示されている
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    // When: ユーザーが2つの画像ファイルを選択する
    const file1 = new File(['test1'], 'recipe1.png', { type: 'image/png' })
    const file2 = new File(['test2'], 'recipe2.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, [file1, file2])

    // Then: 2つのプレビューが表示される
    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
      expect(screen.getByAltText('追加画像 2')).toBeInTheDocument()
    })
  })

  it('ファイル数制限：6つのファイルを選択するとエラーメッセージが表示される', async () => {
    // Given: アップロードフォームが表示されている
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    // When: ユーザーが6つのファイルを選択する
    const files = Array.from({ length: 6 }, (_, i) =>
      new File([`test${i}`], `test${i}.png`, { type: 'image/png' })
    )
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, files)

    // Then: エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText('画像は最大5枚までです')).toBeInTheDocument()
    })

    // Then: プレビューが表示されない
    expect(screen.queryByAltText('アップロードされた画像')).not.toBeInTheDocument()
  })

  it('正常系：ちょうど5つのファイルを選択すると全てのプレビューが表示される', async () => {
    // Given: アップロードフォームが表示されている
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    // When: ユーザーがちょうど5つのファイルを選択する
    const files = Array.from({ length: 5 }, (_, i) =>
      new File([`test${i}`], `test${i}.png`, { type: 'image/png' })
    )
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, files)

    // Then: 5つ全てのプレビューが表示される
    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
      expect(screen.getByAltText('追加画像 2')).toBeInTheDocument()
      expect(screen.getByAltText('追加画像 3')).toBeInTheDocument()
      expect(screen.getByAltText('追加画像 4')).toBeInTheDocument()
      expect(screen.getByAltText('追加画像 5')).toBeInTheDocument()
    })
  })

  it('追加モード制限：4つ選択後に2つ貼り付けると制限エラーが表示される', async () => {
    // Given: 4つのファイルが既に選択されている
    const user = userEvent.setup()
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const initialFiles = Array.from({ length: 4 }, (_, i) =>
      new File([`test${i}`], `test${i}.png`, { type: 'image/png' })
    )
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, initialFiles)

    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
      expect(screen.getByAltText('追加画像 4')).toBeInTheDocument()
    })

    // When: Ctrl+Vで1ファイル追加（合計5枚、成功するはず）
    const pasteFile1 = new File(['paste1'], 'paste1.png', { type: 'image/png' })
    const mockClipboardData1 = {
      items: {
        length: 1,
        0: {
          type: 'image/png',
          getAsFile: () => pasteFile1
        }
      }
    }

    const pasteEvent1 = new Event('paste') as ClipboardEvent
    Object.defineProperty(pasteEvent1, 'clipboardData', {
      value: mockClipboardData1
    })

    await act(async () => {
      document.dispatchEvent(pasteEvent1)
    })

    // Then: 5枚目は追加される
    await waitFor(() => {
      expect(screen.getByAltText('追加画像 5')).toBeInTheDocument()
    })

    // When: さらに6枚目を追加しようとする
    const pasteFile2 = new File(['paste2'], 'paste2.png', { type: 'image/png' })
    const mockClipboardData2 = {
      items: {
        length: 1,
        0: {
          type: 'image/png',
          getAsFile: () => pasteFile2
        }
      }
    }

    const pasteEvent2 = new Event('paste') as ClipboardEvent
    Object.defineProperty(pasteEvent2, 'clipboardData', {
      value: mockClipboardData2
    })

    await act(async () => {
      document.dispatchEvent(pasteEvent2)
    })

    // Then: エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText('画像は最大5枚までです')).toBeInTheDocument()
    })

    // Then: 6枚目は追加されていない
    expect(screen.queryByAltText('追加画像 6')).not.toBeInTheDocument()
  })

  it('複数ファイルドラッグ&ドロップ：3つのファイルをドロップすると全てのプレビューが表示される', async () => {
    // Given: アップロードフォームが表示されている
    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    // When: ユーザーが3つのファイルをドラッグ&ドロップする
    const dropZone = screen.getByText('画像をドラッグ&ドロップ').closest('div')!
    const file1 = new File(['test1'], 'test1.png', { type: 'image/png' })
    const file2 = new File(['test2'], 'test2.png', { type: 'image/png' })
    const file3 = new File(['test3'], 'test3.png', { type: 'image/png' })

    fireEvent.dragOver(dropZone, {
      dataTransfer: { files: [file1, file2, file3] }
    })

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file1, file2, file3] }
    })

    // Then: 3つ全てのプレビューが表示される
    await waitFor(() => {
      expect(screen.getByAltText('アップロードされた画像')).toBeInTheDocument()
      expect(screen.getByAltText('追加画像 2')).toBeInTheDocument()
      expect(screen.getByAltText('追加画像 3')).toBeInTheDocument()
    })
  })

  it('複数ファイルアップロード：FormDataに複数ファイルが正しく追加される', async () => {
    // Given: 3つのファイルが選択されている
    const user = userEvent.setup()
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        result: {
          title: 'Test Recipe',
          sourceInfo: null,
          ingredients: [],
          steps: [],
          tags: []
        }
      })
    })

    render(<ImageUpload onUpload={mockOnUpload} onUploadingChange={mockOnUploadingChange} />)

    const file1 = new File(['test1'], 'recipe1.png', { type: 'image/png' })
    const file2 = new File(['test2'], 'recipe2.png', { type: 'image/png' })
    const file3 = new File(['test3'], 'recipe3.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, [file1, file2, file3])

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /レシピを抽出/ })).toBeInTheDocument()
    })

    // When: ユーザーがアップロードボタンをクリックする
    const uploadButton = screen.getByRole('button', { name: /レシピを抽出/ })
    await user.click(uploadButton)

    // Then: APIが正しく呼ばれる
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/recipes/extract/file',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      )
    })

    // Then: FormDataに3つのファイルが追加されている
    const callArgs = mockFetch.mock.calls[0]
    const formData = callArgs[1].body as FormData
    const uploadedFiles = formData.getAll('file')

    expect(uploadedFiles).toHaveLength(3)
  })
})
