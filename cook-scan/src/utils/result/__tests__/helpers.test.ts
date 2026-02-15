import { describe, it, expect } from 'vitest'
import { success, failure, createError, Errors } from '../helpers'
import type { AppError } from '../types'

describe('result helpers', () => {
  describe('success', () => {
    it('成功結果を生成する（文字列データ）', () => {
      const result = success('test data')
      expect(result).toEqual({
        ok: true,
        data: 'test data',
      })
    })

    it('成功結果を生成する（数値データ）', () => {
      const result = success(123)
      expect(result).toEqual({
        ok: true,
        data: 123,
      })
    })

    it('成功結果を生成する（オブジェクトデータ）', () => {
      const data = { id: 1, name: 'test' }
      const result = success(data)
      expect(result).toEqual({
        ok: true,
        data,
      })
    })

    it('成功結果を生成する（nullデータ）', () => {
      const result = success(null)
      expect(result).toEqual({
        ok: true,
        data: null,
      })
    })

    it('成功結果を生成する（undefinedデータ）', () => {
      const result = success(undefined)
      expect(result).toEqual({
        ok: true,
        data: undefined,
      })
    })

    it('成功結果のok属性がtrueである', () => {
      const result = success('data')
      expect(result.ok).toBe(true)
    })
  })

  describe('failure', () => {
    it('失敗結果を生成する（基本的なエラー）', () => {
      const error: AppError = {
        code: 'NOT_FOUND',
        message: 'リソースが見つかりません',
      }
      const result = failure(error)
      expect(result).toEqual({
        ok: false,
        error,
      })
    })

    it('失敗結果を生成する（詳細情報付きエラー）', () => {
      const error: AppError = {
        code: 'VALIDATION_ERROR',
        message: 'バリデーションエラー',
        details: { field: 'email', reason: 'invalid format' },
      }
      const result = failure(error)
      expect(result).toEqual({
        ok: false,
        error,
      })
    })

    it('失敗結果のok属性がfalseである', () => {
      const error: AppError = {
        code: 'SERVER_ERROR',
        message: 'エラー',
      }
      const result = failure(error)
      expect(result.ok).toBe(false)
    })
  })

  describe('createError', () => {
    it('詳細情報なしでエラーを生成する', () => {
      const error = createError('NOT_FOUND', 'リソースが見つかりません')
      expect(error).toEqual({
        code: 'NOT_FOUND',
        message: 'リソースが見つかりません',
      })
    })

    it('詳細情報ありでエラーを生成する', () => {
      const details = { resourceId: 123, resourceType: 'user' }
      const error = createError('NOT_FOUND', 'ユーザーが見つかりません', details)
      expect(error).toEqual({
        code: 'NOT_FOUND',
        message: 'ユーザーが見つかりません',
        details,
      })
    })

    it('すべてのエラーコードで生成できる（UNAUTHENTICATED）', () => {
      const error = createError('UNAUTHENTICATED', '認証が必要です')
      expect(error.code).toBe('UNAUTHENTICATED')
    })

    it('すべてのエラーコードで生成できる（FORBIDDEN）', () => {
      const error = createError('FORBIDDEN', '権限がありません')
      expect(error.code).toBe('FORBIDDEN')
    })

    it('すべてのエラーコードで生成できる（VALIDATION_ERROR）', () => {
      const error = createError('VALIDATION_ERROR', 'バリデーションエラー')
      expect(error.code).toBe('VALIDATION_ERROR')
    })

    it('すべてのエラーコードで生成できる（CONFLICT）', () => {
      const error = createError('CONFLICT', '競合エラー')
      expect(error.code).toBe('CONFLICT')
    })

    it('すべてのエラーコードで生成できる（SERVER_ERROR）', () => {
      const error = createError('SERVER_ERROR', 'サーバーエラー')
      expect(error.code).toBe('SERVER_ERROR')
    })
  })

  describe('Errors preset', () => {
    describe('unauthenticated', () => {
      it('デフォルトメッセージで認証エラーを生成する', () => {
        const error = Errors.unauthenticated()
        expect(error).toEqual({
          code: 'UNAUTHENTICATED',
          message: '認証が必要です',
        })
      })

      it('カスタムメッセージで認証エラーを生成する', () => {
        const error = Errors.unauthenticated('ログインしてください')
        expect(error).toEqual({
          code: 'UNAUTHENTICATED',
          message: 'ログインしてください',
        })
      })
    })

    describe('forbidden', () => {
      it('デフォルトメッセージで権限エラーを生成する', () => {
        const error = Errors.forbidden()
        expect(error).toEqual({
          code: 'FORBIDDEN',
          message: 'この操作を行う権限がありません',
        })
      })

      it('カスタムメッセージで権限エラーを生成する', () => {
        const error = Errors.forbidden('管理者権限が必要です')
        expect(error).toEqual({
          code: 'FORBIDDEN',
          message: '管理者権限が必要です',
        })
      })
    })

    describe('notFound', () => {
      it('リソース名を含むエラーを生成する', () => {
        const error = Errors.notFound('ユーザー')
        expect(error).toEqual({
          code: 'NOT_FOUND',
          message: 'ユーザーが見つかりません',
        })
      })

      it('別のリソース名で正しいエラーを生成する', () => {
        const error = Errors.notFound('レシピ')
        expect(error).toEqual({
          code: 'NOT_FOUND',
          message: 'レシピが見つかりません',
        })
      })
    })

    describe('validation', () => {
      it('詳細情報なしでバリデーションエラーを生成する', () => {
        const error = Errors.validation('入力値が不正です')
        expect(error).toEqual({
          code: 'VALIDATION_ERROR',
          message: '入力値が不正です',
        })
      })

      it('詳細情報ありでバリデーションエラーを生成する', () => {
        const details = { field: 'email', reason: 'invalid format' }
        const error = Errors.validation('メールアドレスの形式が不正です', details)
        expect(error).toEqual({
          code: 'VALIDATION_ERROR',
          message: 'メールアドレスの形式が不正です',
          details,
        })
      })

      it('複雑な詳細情報でバリデーションエラーを生成する', () => {
        const details = {
          errors: {
            email: ['required', 'invalid format'],
            password: ['too short'],
          },
        }
        const error = Errors.validation('複数のバリデーションエラー', details)
        expect(error.details).toEqual(details)
      })
    })

    describe('conflict', () => {
      it('競合エラーを生成する', () => {
        const error = Errors.conflict('既に存在します')
        expect(error).toEqual({
          code: 'CONFLICT',
          message: '既に存在します',
        })
      })

      it('別のメッセージで競合エラーを生成する', () => {
        const error = Errors.conflict('このメールアドレスは既に使用されています')
        expect(error).toEqual({
          code: 'CONFLICT',
          message: 'このメールアドレスは既に使用されています',
        })
      })
    })

    describe('server', () => {
      it('デフォルトメッセージでサーバーエラーを生成する', () => {
        const error = Errors.server()
        expect(error).toEqual({
          code: 'SERVER_ERROR',
          message: 'サーバーエラーが発生しました',
        })
      })

      it('カスタムメッセージでサーバーエラーを生成する', () => {
        const error = Errors.server('データベース接続エラー')
        expect(error).toEqual({
          code: 'SERVER_ERROR',
          message: 'データベース接続エラー',
        })
      })
    })
  })

  describe('統合テスト', () => {
    it('success() と failure() を組み合わせて使用できる', () => {
      const successResult = success({ id: 1 })
      const failureResult = failure(Errors.notFound('リソース'))

      expect(successResult.ok).toBe(true)
      expect(failureResult.ok).toBe(false)
    })

    it('createError() と failure() を組み合わせて使用できる', () => {
      const error = createError('VALIDATION_ERROR', 'エラー', { field: 'name' })
      const result = failure(error)

      expect(result.ok).toBe(false)
      expect(result.error.code).toBe('VALIDATION_ERROR')
      expect(result.error.details).toEqual({ field: 'name' })
    })

    it('Errors プリセットと failure() を組み合わせて使用できる', () => {
      const result = failure(Errors.unauthenticated())

      expect(result.ok).toBe(false)
      expect(result.error.code).toBe('UNAUTHENTICATED')
      expect(result.error.message).toBe('認証が必要です')
    })
  })
})
