import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'
import { SpinnerIcon } from '@/components/icons'

const buttonVariants = cva(
  // 共通スタイル
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        // プライマリ: グラデーション付きメインボタン
        primary:
          'bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-primary hover:shadow-primary-hover',
        // セカンダリ: 白背景のボタン
        secondary:
          'border border-border-dark bg-white text-foreground shadow-sm hover:bg-muted hover:text-primary',
        // ゴースト: 背景なしのボタン
        ghost:
          'text-muted-foreground hover:bg-muted hover:text-foreground',
        // デンジャー: 削除などの危険なアクション
        danger:
          'bg-danger text-danger-foreground shadow-danger hover:bg-danger-hover hover:shadow-danger-hover',
        // デンジャーゴースト: 削除アクションのゴースト版
        'danger-ghost':
          'text-danger hover:bg-danger-light hover:text-danger-hover',
        // リンク: テキストリンクスタイル
        link:
          'text-primary underline-offset-4 hover:underline',
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

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
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

export { Button, buttonVariants }
