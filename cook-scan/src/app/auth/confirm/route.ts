import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Route } from 'next'

function isLocalPath(path: string | null | undefined): boolean {
  if (!path) return false
  return path.startsWith('/') && !path.startsWith('//')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const nextParam = searchParams.get('next') ?? '/'
  const next = isLocalPath(nextParam) ? nextParam : '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // 招待の場合はパスワード設定ページへリダイレクト
      if (type === 'invite') {
        redirect('/password/setup')
      }
      // redirect user to specified redirect URL or root of app
      redirect(next as Route)
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/login')
}