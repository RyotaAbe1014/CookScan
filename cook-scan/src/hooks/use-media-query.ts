'use client'

import { useState, useEffect } from 'react'

/**
 * メディアクエリの状態を監視するカスタムフック
 * @param query - メディアクエリ文字列 (例: '(min-width: 640px)')
 * @returns メディアクエリがマッチしているかどうか
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  // windowオブジェクトはサーバー側に存在しないため、クライアント側で初期化
  useEffect(() => {
    const media = window.matchMedia(query)
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
