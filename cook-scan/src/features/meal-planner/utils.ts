/**
 * 献立プランナーユーティリティ
 */

export const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'] as const

/**
 * 指定日付の週の月曜日をYYYY-MM-DD文字列で返す
 * ローカルタイムゾーンベースで計算する
 */
export function getWeekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  // 日曜(0)なら-6、それ以外は1を引く
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const dayOfMonth = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${dayOfMonth}`
}

/**
 * YYYY-MM-DD文字列をローカルタイムゾーンのDateに変換する
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * weekStart文字列から各曜日の日付を生成
 */
export function getWeekDates(weekStart: string): Date[] {
  const start = parseLocalDate(weekStart)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

/**
 * 日付をフォーマット (M/D)
 */
export function formatShortDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`
}
