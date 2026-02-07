export type ChildRecipeItem = {
  childRecipeId: string
  childRecipeTitle: string
  quantity: string
  notes: string
}

export type ChildRecipeInputProps = {
  item: ChildRecipeItem
  index: number
  onUpdate: (index: number, field: 'quantity' | 'notes', value: string) => void
  onRemove: (index: number) => void
}

export type ChildRecipeSelectorDialogProps = {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: ChildRecipeItem) => void
  parentRecipeId?: string
  existingChildRecipeIds: string[]
}
