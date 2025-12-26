import { describe, test, expect, beforeEach, vi } from 'vitest'
import {
  requestNotificationPermission,
  showTimerNotification,
  playNotificationSound,
  setNotificationSoundEnabled,
  isNotificationSoundEnabled,
} from '../timer-notifications'

describe('timer-notifications', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks()
    // Notification APIのモック
    global.Notification = {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  })

  describe('requestNotificationPermission', () => {
    test('正常系：通知許可が既に取得されている場合はtrueを返す', async () => {
      // Given: 通知許可が既に取得されている
      Object.defineProperty(global.Notification, 'permission', {
        writable: true,
        value: 'granted',
      })

      // When: 通知許可をリクエストする
      const result = await requestNotificationPermission()

      // Then: trueが返される
      expect(result).toBe(true)

      // Then: requestPermissionは呼ばれない
      expect(global.Notification.requestPermission).not.toHaveBeenCalled()
    })

    test('正常系：通知許可をリクエストして成功する', async () => {
      // Given: 通知許可が未取得
      Object.defineProperty(global.Notification, 'permission', {
        writable: true,
        value: 'default',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(global.Notification.requestPermission as any).mockResolvedValue('granted')

      // When: 通知許可をリクエストする
      const result = await requestNotificationPermission()

      // Then: trueが返される
      expect(result).toBe(true)

      // Then: requestPermissionが呼ばれる
      expect(global.Notification.requestPermission).toHaveBeenCalledTimes(1)
    })

    test('正常系：通知許可が拒否された場合はfalseを返す', async () => {
      // Given: 通知許可が拒否される
      Object.defineProperty(global.Notification, 'permission', {
        writable: true,
        value: 'default',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(global.Notification.requestPermission as any).mockResolvedValue('denied')

      // When: 通知許可をリクエストする
      const result = await requestNotificationPermission()

      // Then: falseが返される
      expect(result).toBe(false)
    })

    test('正常系：Notification APIが存在しない場合はfalseを返す', async () => {
      // Given: Notification APIが存在しない
      const originalNotification = global.Notification
      // @ts-expect-error - テスト用に削除
      delete global.Notification

      // When: 通知許可をリクエストする
      const result = await requestNotificationPermission()

      // Then: falseが返される
      expect(result).toBe(false)

      // クリーンアップ
      global.Notification = originalNotification
    })
  })

  describe('showTimerNotification', () => {
    test('正常系：通知許可がある場合は通知を表示する', () => {
      // Given: 通知許可が取得されている
      const NotificationConstructor = vi.fn()
      global.Notification = NotificationConstructor as any // eslint-disable-line @typescript-eslint/no-explicit-any
      Object.defineProperty(global.Notification, 'permission', {
        writable: true,
        value: 'granted',
      })
      // AudioContextをモック（エラーを抑制）
      global.AudioContext = vi.fn().mockImplementation(() => {
        throw new Error('AudioContext not available')
      }) as any // eslint-disable-line @typescript-eslint/no-explicit-any

      // When: 通知を表示する
      showTimerNotification(1, '5分間煮込む')

      // Then: Notificationコンストラクタが呼ばれる
      expect(NotificationConstructor).toHaveBeenCalledWith('調理タイマー', {
        body: 'ステップ1: 5分間煮込む のタイマーが終了しました',
        icon: '/favicon.ico',
        tag: 'timer-1',
        requireInteraction: false,
      })
    })

    test('正常系：通知許可がない場合は通知を表示しない', () => {
      // Given: 通知許可が取得されていない
      const NotificationConstructor = vi.fn()
      global.Notification = NotificationConstructor as any // eslint-disable-line @typescript-eslint/no-explicit-any
      Object.defineProperty(global.Notification, 'permission', {
        writable: true,
        value: 'denied',
      })
      // AudioContextをモック（エラーを抑制）
      global.AudioContext = vi.fn().mockImplementation(() => {
        throw new Error('AudioContext not available')
      }) as any // eslint-disable-line @typescript-eslint/no-explicit-any

      // When: 通知を表示する
      showTimerNotification(1, '5分間煮込む')

      // Then: Notificationコンストラクタが呼ばれない
      expect(NotificationConstructor).not.toHaveBeenCalled()
    })
  })

  describe('setNotificationSoundEnabled / isNotificationSoundEnabled', () => {
    test('正常系：音声通知の有効/無効を設定できる', () => {
      // Given: デフォルトで有効になっている
      expect(isNotificationSoundEnabled()).toBe(true)

      // When: 無効にする
      setNotificationSoundEnabled(false)

      // Then: 無効になっている
      expect(isNotificationSoundEnabled()).toBe(false)

      // When: 再度有効にする
      setNotificationSoundEnabled(true)

      // Then: 有効になっている
      expect(isNotificationSoundEnabled()).toBe(true)
    })
  })

  describe('playNotificationSound', () => {
    test('正常系：音声通知が無効の場合は再生しない', () => {
      // Given: 音声通知が無効になっている
      setNotificationSoundEnabled(false)
      const createOscillator = vi.fn()

      // AudioContextをクラスとしてモック
      class MockAudioContext {
        createOscillator = createOscillator
        createGain = vi.fn()
        currentTime = 0
        destination = {}
      }

      global.AudioContext = MockAudioContext as any // eslint-disable-line @typescript-eslint/no-explicit-any

      // When: 通知音を再生しようとする
      playNotificationSound()

      // Then: オシレーターが作成されない
      expect(createOscillator).not.toHaveBeenCalled()

      // クリーンアップ
      setNotificationSoundEnabled(true)
    })

    test('正常系：音声通知が有効の場合は再生する', () => {
      // Given: 音声通知が有効になっている
      setNotificationSoundEnabled(true)
      const createOscillator = vi.fn()
      const createGain = vi.fn()
      const connect = vi.fn()
      const setValueAtTime = vi.fn()
      const exponentialRampToValueAtTime = vi.fn()
      const start = vi.fn()
      const stop = vi.fn()

      const mockOscillator = {
        connect,
        frequency: { value: 0 },
        type: '',
        start,
        stop,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onended: null as any,
      }
      const mockGainNode = {
        connect,
        gain: {
          setValueAtTime,
          exponentialRampToValueAtTime,
        },
      }

      createOscillator.mockReturnValue(mockOscillator)
      createGain.mockReturnValue(mockGainNode)

      // AudioContextをクラスとしてモック
      class MockAudioContext {
        createOscillator = createOscillator
        createGain = createGain
        currentTime = 0
        destination = {}
      }

      global.AudioContext = MockAudioContext as any // eslint-disable-line @typescript-eslint/no-explicit-any

      // When: 通知音を再生する
      playNotificationSound()

      // Then: オシレーターが作成される
      expect(createOscillator).toHaveBeenCalledTimes(1)
      expect(createGain).toHaveBeenCalledTimes(1)
      expect(connect).toHaveBeenCalled()
      expect(start).toHaveBeenCalledTimes(1)
      expect(stop).toHaveBeenCalledTimes(1)
    })
  })
})
