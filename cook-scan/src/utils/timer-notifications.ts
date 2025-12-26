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

  // 音声通知（オプション）
  playNotificationSound()
}

// 音声通知の実装
let audioContext: AudioContext | null = null
let notificationSoundEnabled = true

// 音声通知の有効/無効を設定
export function setNotificationSoundEnabled(enabled: boolean): void {
  notificationSoundEnabled = enabled
}

export function isNotificationSoundEnabled(): boolean {
  return notificationSoundEnabled
}

// 通知音を再生
export function playNotificationSound(): void {
  if (!notificationSoundEnabled) {
    return
  }

  try {
    // Web Audio APIを使用してビープ音を生成
    if (!audioContext) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      audioContext = new AudioContextClass()
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // ビープ音の設定
    oscillator.frequency.value = 800 // 800Hz
    oscillator.type = 'sine'

    // 音量の設定（0.0 - 1.0）
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    // 0.5秒間再生
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)

    // エラー処理
    oscillator.onended = () => {
      // 必要に応じてクリーンアップ
    }
  } catch (error) {
    console.error('Failed to play notification sound:', error)
    // フォールバック: HTML5 Audio APIを使用（オプション）
    // 音声ファイルが存在する場合のみ使用
    // try {
    //   const audio = new Audio('/sounds/timer-beep.mp3')
    //   audio.volume = 0.5
    //   audio.play().catch(err => {
    //     console.error('Failed to play audio file:', err)
    //   })
    // } catch (fallbackError) {
    //   console.error('Failed to use audio fallback:', fallbackError)
    // }
  }
}
