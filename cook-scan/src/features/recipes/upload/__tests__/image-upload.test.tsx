import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImageUpload from '../image-upload'

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />
}))

// Mock fetch
global.fetch = vi.fn()

// Mock FileReader
class MockFileReader {
  result: string | ArrayBuffer | null = null
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null

  readAsDataURL(file: Blob) {
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
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
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
      expect(mockAlert).toHaveBeenCalledWith('アップロードエラー')
    })

    mockAlert.mockRestore()
  })

  it('shows alert on network error', async () => {
    const user = userEvent.setup()
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})

    ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))

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
      expect(mockAlert).toHaveBeenCalledWith('ネットワークエラーが発生しました')
    })

    mockAlert.mockRestore()
  })

  it('disables buttons during upload', async () => {
    const user = userEvent.setup()

    // Create a promise that we control
    let resolveUpload: (value: any) => void
    const uploadPromise = new Promise((resolve) => {
      resolveUpload = resolve
    })

    ;(global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(uploadPromise)

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
})
