// ブラウザ通知の許可リクエスト
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// ブラウザ通知の表示
export function showTimerNotification(stepNumber: number, instruction: string): void {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification('調理タイマー', {
        body: `ステップ${stepNumber}: ${instruction} のタイマーが終了しました`,
        icon: '/favicon.ico',
        tag: `timer-${stepNumber}`,
        requireInteraction: false, // 自動的に閉じる
      })
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }
}
