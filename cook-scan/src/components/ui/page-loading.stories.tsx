import type { Meta, StoryObj } from 'storybook'
import { PageLoading } from './page-loading'

const meta = {
  title: 'UI/PageLoading',
  component: PageLoading,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageLoading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
