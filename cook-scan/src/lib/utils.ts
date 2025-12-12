import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS クラス名を結合するユーティリティ関数
 * clsx でクラスを結合し、tailwind-merge で競合を解決
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
