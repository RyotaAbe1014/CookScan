'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { inviteUser } from './actions'
import { toast } from 'sonner'
import { isSuccess } from '@/utils/result'
import type { InviteFormData } from './types'

export const InviteUserForm = () => {
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('メールアドレスを入力してください')
      return
    }

    const formData: InviteFormData = { email: email.trim() }

    startTransition(async () => {
      const result = await inviteUser(formData.email)

      if (isSuccess(result)) {
        toast.success('招待の送信に成功しました')
        setEmail('')
      } else {
        toast.error(result.error.message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="invite-email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          メールアドレス
        </label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          disabled={isPending}
          required
        />
      </div>

      <Button type="submit" disabled={isPending} variant="primary" isLoading={isPending}>
        {isPending ? '送信中...' : '招待を送信する'}
      </Button>
    </form>
  )
}
