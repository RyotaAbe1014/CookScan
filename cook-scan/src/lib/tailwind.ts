import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSSクラス名をマージするユーティリティ関数
 * clsxとtailwind-mergeを組み合わせて、クラス名の競合を適切に解決します
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
