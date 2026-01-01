'use client'

import { useState, useEffect } from 'react'

/**
 * メディアクエリの状態を監視するカスタムフック
 * @param query - メディアクエリ文字列 (例: '(min-width: 640px)')
 * @returns メディアクエリがマッチしているかどうか
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

/**
 * モバイルデバイスかどうかを判定するフック
 * Tailwind CSS の sm ブレークポイント (640px) を基準
 * @returns モバイルデバイスの場合 true
 */
export function useIsMobile(): boolean {
  return !useMediaQuery('(min-width: 640px)')
}
