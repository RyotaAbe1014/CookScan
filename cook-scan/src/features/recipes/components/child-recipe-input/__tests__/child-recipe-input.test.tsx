import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChildRecipeInput } from '../child-recipe-input'
import type { ChildRecipeItem } from '../types'

describe('ChildRecipeInput', () => {
  const mockItem: ChildRecipeItem = {
    childRecipeId: 'child-1',
    childRecipeTitle: '自家製ドレッシング',
    quantity: '大さじ2',
    notes: '事前に作っておく',
  }

  it('子レシピのタイトルが表示される', () => {
    render(
      <ChildRecipeInput item={mockItem} index={0} onUpdate={vi.fn()} onRemove={vi.fn()} />
    )
    expect(screen.getByText('自家製ドレッシング')).toBeInTheDocument()
  })

  it('分量の値が表示される', () => {
    render(
      <ChildRecipeInput item={mockItem} index={0} onUpdate={vi.fn()} onRemove={vi.fn()} />
    )
    expect(screen.getByDisplayValue('大さじ2')).toBeInTheDocument()
  })

  it('メモの値が表示される', () => {
    render(
      <ChildRecipeInput item={mockItem} index={0} onUpdate={vi.fn()} onRemove={vi.fn()} />
    )
    expect(screen.getByDisplayValue('事前に作っておく')).toBeInTheDocument()
  })

  it('分量を更新するとonUpdateが呼ばれる', async () => {
    const onUpdate = vi.fn()
    const user = userEvent.setup()

    render(
      <ChildRecipeInput item={mockItem} index={0} onUpdate={onUpdate} onRemove={vi.fn()} />
    )

    const quantityInput = screen.getByDisplayValue('大さじ2')
    await user.clear(quantityInput)
    await user.type(quantityInput, '大さじ3')

    expect(onUpdate).toHaveBeenCalledWith(0, 'quantity', expect.any(String))
  })

  it('メモを更新するとonUpdateが呼ばれる', async () => {
    const onUpdate = vi.fn()
    const user = userEvent.setup()

    render(
      <ChildRecipeInput item={mockItem} index={0} onUpdate={onUpdate} onRemove={vi.fn()} />
    )

    const notesInput = screen.getByDisplayValue('事前に作っておく')
    await user.clear(notesInput)
    await user.type(notesInput, '冷やしておく')

    expect(onUpdate).toHaveBeenCalledWith(0, 'notes', expect.any(String))
  })

  it('削除ボタンをクリックするとonRemoveが呼ばれる', async () => {
    const onRemove = vi.fn()
    const user = userEvent.setup()

    render(
      <ChildRecipeInput item={mockItem} index={2} onUpdate={vi.fn()} onRemove={onRemove} />
    )

    const deleteButton = screen.getByRole('button', { name: /自家製ドレッシングを削除/ })
    await user.click(deleteButton)

    expect(onRemove).toHaveBeenCalledWith(2)
  })
})
