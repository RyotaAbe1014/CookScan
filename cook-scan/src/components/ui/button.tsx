import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'
import { SpinnerIcon } from '@/components/icons/spinner-icon'

const buttonVariants = cva(
  // 共通スタイル - デザインシステムに準拠
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        // プライマリ: メインアクション（emerald-600）- 単色 + シャドウ
        primary:
          'bg-primary text-primary-foreground shadow-primary hover:bg-primary-hover hover:shadow-primary-hover transition-all duration-200',
        // セカンダリ: サブアクション（gray-300 背景）
        secondary:
          'border border-border-dark bg-white text-foreground shadow-sm hover:bg-muted hover:text-primary transition-all duration-200',
        // ゴースト: テキストボタン
        ghost:
          'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150',
        // デンジャー: 削除・エラーアクション（red-500）
        danger:
          'bg-danger text-danger-foreground shadow-danger hover:bg-danger-hover hover:shadow-danger-hover transition-all duration-200',
        // デンジャーゴースト: 削除のゴーストボタン
        'danger-ghost':
          'text-danger hover:bg-danger-light hover:text-danger-hover transition-colors duration-150',
        // リンク: リンクスタイル
        link:
          'text-primary underline-offset-4 hover:underline transition-colors duration-150',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** ローディング状態 */
    isLoading?: boolean
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
