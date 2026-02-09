import type { Meta, StoryObj } from '@storybook/nextjs'
import { ChildRecipeSelectorDialog } from './child-recipe-selector-dialog'

const meta = {
  title: 'Features/Recipes/ChildRecipeSelectorDialog',
  component: ChildRecipeSelectorDialog,
  tags: ['autodocs'],
  args: {
    onClose: () => {},
    onAdd: () => {},
    existingChildRecipeIds: [],
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ChildRecipeSelectorDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    isOpen: true,
    parentRecipeId: 'parent-1',
    existingChildRecipeIds: [],
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    parentRecipeId: 'parent-1',
    existingChildRecipeIds: [],
  },
}

export const WithExistingChildren: Story = {
  args: {
    isOpen: true,
    parentRecipeId: 'parent-1',
    existingChildRecipeIds: ['child-1', 'child-2'],
  },
}
