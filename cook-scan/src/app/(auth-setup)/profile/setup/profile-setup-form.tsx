'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProfile } from './actions'

interface ProfileSetupFormProps {
  userId: string
  userEmail: string
}

export default function ProfileSetupForm({ userId, userEmail }: ProfileSetupFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await createProfile(userId, userEmail, name)
      router.push('/')
      router.refresh()
    } catch (err) {
      setError('プロフィールの作成に失敗しました')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          value={userEmail}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="山田 太郎"
          className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? '作成中...' : 'プロフィールを作成'}
      </button>
    </form>
  )
}