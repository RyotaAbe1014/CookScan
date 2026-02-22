import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'

const textareaVariants = cva(
  // 共通スタイル - デザインシステムに準拠
  'block w-full rounded-md border border-border shadow-sm transition-all duration-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground',
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
      size: 'lg',
    },
  }
)

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> &
  VariantProps<typeof textareaVariants>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
