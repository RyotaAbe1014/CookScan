import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/tailwind";

/* =============================================================================
 * Card
 * ============================================================================= */

const cardVariants = cva("overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-gray-900/5", {
  variants: {
    hover: {
      true: "transition-all duration-200 hover:shadow-lg",
      false: "",
    },
  },
  defaultVariants: {
    hover: false,
  },
});

type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, hover, ...props }, ref) => {
  return <div ref={ref} className={cn(cardVariants({ hover, className }))} {...props} />;
});
Card.displayName = "Card";

/* =============================================================================
 * CardHeader
 * ============================================================================= */

/**
 * アイコンバッジのカラープリセット（デザイントークンベース）
 */
type CardHeaderColor =
  | "primary" // 基本情報、画像など
  | "secondary" // メモ、サブレシピ、親レシピ参照
  | "accent-steps" // 調理手順
  | "accent-ingredients" // 材料
  | "accent-tags" // タグ、カテゴリ、ソース情報
  | "warning" // タイマー、警告
  | "danger"; // 削除

const iconColors: Record<CardHeaderColor, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  "accent-steps": "bg-accent-steps",
  "accent-ingredients": "bg-accent-ingredients",
  "accent-tags": "bg-accent-tags",
  warning: "bg-warning",
  danger: "bg-danger",
};

type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** アイコンバッジに表示するアイコン（SVG要素） */
  icon?: ReactNode;
  /** アイコンバッジのグラデーションカラー */
  iconColor?: CardHeaderColor;
  /** ヘッダーのタイトル */
  title?: string;
  /** ヘッダー右側に配置するアクション要素 */
  actions?: ReactNode;
};

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon, iconColor = "primary", title, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-b border-section-header-border bg-linear-to-r from-section-header to-white px-6 py-4",
          className,
        )}
        {...props}
      >
        {children ?? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg shadow-md transition-transform duration-150 hover:scale-105",
                    iconColors[iconColor],
                  )}
                >
                  {icon}
                </div>
              )}
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
      </div>
    );
  },
);
CardHeader.displayName = "CardHeader";

/* =============================================================================
 * CardContent
 * ============================================================================= */

const cardContentVariants = cva("", {
  variants: {
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

type CardContentProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardContentVariants>;

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding, ...props }, ref) => {
    return <div ref={ref} className={cn(cardContentVariants({ padding, className }))} {...props} />;
  },
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardContent };
