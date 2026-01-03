import { describe, test, expect, beforeEach, vi } from 'vitest'
import {
  requestNotificationPermission,
  showTimerNotification,
} from '../timer-notifications'

describe('timer-notifications', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks()
    // Notification APIのモック
    global.Notification = {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted'),
       
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
      global.Notification = NotificationConstructor as any  
      Object.defineProperty(global.Notification, 'permission', {
        writable: true,
        value: 'granted',
      })

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
      global.Notification = NotificationConstructor as any  
      Object.defineProperty(global.Notification, 'permission', {
        writable: true,
        value: 'denied',
      })
      // When: 通知を表示する
      showTimerNotification(1, '5分間煮込む')

      // Then: Notificationコンストラクタが呼ばれない
      expect(NotificationConstructor).not.toHaveBeenCalled()
    })
  })
})
