import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'

const selectVariants = cva(
  // 共通スタイル
  'block w-full rounded-lg border border-gray-300 bg-white shadow-sm transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50',
  {
    variants: {
      variant: {
        // デフォルト: インディゴフォーカス
        default: 'focus:border-indigo-500 focus:ring-indigo-500/20',
        // グリーン: 材料入力用
        green: 'focus:border-green-500 focus:ring-green-500/20',
        // ブルー: 調理手順用
        blue: 'focus:border-blue-500 focus:ring-blue-500/20',
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 sm:text-sm',
        xl: 'px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'xl',
    },
  }
)

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> &
  VariantProps<typeof selectVariants>

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <select
        className={cn(selectVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

export { Select, selectVariants }
