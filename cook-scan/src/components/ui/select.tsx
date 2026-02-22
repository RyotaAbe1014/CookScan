import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'

const selectVariants = cva(
  // 共通スタイル - デザインシステムに準拠
  'block w-full rounded-md border border-border bg-white shadow-sm transition-all duration-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground',
  {
    variants: {
      variant: {
        // デフォルト: Emeraldフォーカス
        default: 'focus:border-primary focus:ring-primary/20',
        // グリーン: 材料入力用（Emerald系）
        green: 'focus:border-accent-ingredients focus:ring-accent-ingredients/20',
        // ブルー: 調理手順用（Sky系）
        blue: 'focus:border-accent-steps focus:ring-accent-steps/20',
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-sm',
        xl: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'xl',
    },
  }
)

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> &
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

export { Select }
