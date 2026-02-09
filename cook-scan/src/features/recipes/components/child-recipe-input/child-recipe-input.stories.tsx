import type { Meta, StoryObj } from '@storybook/nextjs'
import { ChildRecipeInput } from './child-recipe-input'

const meta = {
  title: 'Features/Recipes/ChildRecipeInput',
  component: ChildRecipeInput,
  tags: ['autodocs'],
  args: {
    onUpdate: () => {},
    onRemove: () => {},
  },
} satisfies Meta<typeof ChildRecipeInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    item: {
      childRecipeId: '1',
      childRecipeTitle: '自家製トマトソース',
      quantity: '大さじ2',
      notes: '事前に作っておく',
    },
    index: 0,
  },
}

export const EmptyFields: Story = {
  args: {
    item: {
      childRecipeId: '2',
      childRecipeTitle: 'だし汁',
      quantity: '',
      notes: '',
    },
    index: 0,
  },
}

export const LongTitle: Story = {
  args: {
    item: {
      childRecipeId: '3',
      childRecipeTitle: '特製ガーリックバターソース（にんにくたっぷりバージョン）',
      quantity: '100ml',
      notes: '冷蔵庫で一晩寝かせたものを使う',
    },
    index: 2,
  },
}

export const MultipleItems: Story = {
  args: {
    item: {
      childRecipeId: '1',
      childRecipeTitle: '自家製トマトソース',
      quantity: '大さじ2',
      notes: '',
    },
    index: 0,
  },
  render: (args) => (
    <div className="flex max-w-lg flex-col gap-3">
      <ChildRecipeInput
        {...args}
        item={{
          childRecipeId: '1',
          childRecipeTitle: '自家製トマトソース',
          quantity: '大さじ2',
          notes: '',
        }}
        index={0}
      />
      <ChildRecipeInput
        {...args}
        item={{
          childRecipeId: '2',
          childRecipeTitle: 'だし汁',
          quantity: '200ml',
          notes: '昆布だし推奨',
        }}
        index={1}
      />
      <ChildRecipeInput
        {...args}
        item={{
          childRecipeId: '3',
          childRecipeTitle: 'ホワイトソース',
          quantity: '',
          notes: '',
        }}
        index={2}
      />
    </div>
  ),
}
