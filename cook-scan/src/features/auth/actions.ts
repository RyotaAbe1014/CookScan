'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import type { Result } from '@/utils/result'
import { failure, Errors } from '@/utils/result'

// ログインバリデーションスキーマ
const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

export async function login(formData: FormData): Promise<Result<void>> {
  const supabase = await createClient()

  // バリデーション
  const validationResult = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validationResult.success) {
    return failure(Errors.validation(validationResult.error.errors[0].message))
  }

  const { email, password } = validationResult.data

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Supabaseのエラーメッセージをユーザーフレンドリーに変換
    if (error.message.includes('Invalid login credentials')) {
      return failure(Errors.validation('メールアドレスまたはパスワードが正しくありません'))
    }
    return failure(Errors.server('ログインに失敗しました。時間をおいて再度お試しください。'))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
