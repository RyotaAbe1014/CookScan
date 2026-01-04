/**
 * URLが安全なスキーム（httpまたはhttpsのみ）を使用しているか検証する
 * @param url - 検証するURL文字列
 * @returns URLが安全な場合true、そうでない場合false
 */
export function isValidHttpUrl(url: string | null | undefined): boolean {
  if (!url) {
    return false
  }

  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    // 無効なURL形式
    return false
  }
}

/**
 * URLをサニタイズし、安全でない場合はnullを返す
 * @param url - サニタイズするURL文字列
 * @returns 安全な場合は元のURL、安全でないまたは無効な場合はnull
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null
  }

  return isValidHttpUrl(url) ? url : null
}
