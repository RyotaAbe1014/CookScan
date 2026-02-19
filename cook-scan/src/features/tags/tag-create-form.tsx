'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createTagCategory, createTag } from './actions'
import { isSuccess } from '@/utils/result'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Alert } from '@/components/ui/alert'
import type { TagCategoryBasic } from '@/types/tag'
import { TagIcon } from '@/components/icons/tag-icon'
import { FolderIcon } from '@/components/icons/folder-icon'
import { PlusIcon } from '@/components/icons/plus-icon'

type TagCreateFormProps = {
  categories: TagCategoryBasic[]
}

type TagFormProps = {
  categories: TagCategoryBasic[]
}

function TagForm({ categories }: TagFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories.find((c) => !c.isSystem)?.id || categories[0]?.id || ''
  )
  const [tagName, setTagName] = useState('')
  const [tagDescription, setTagDescription] = useState('')
  const [tagSuccess, setTagSuccess] = useState<string | null>(null)
  const [isSubmittingTag, setIsSubmittingTag] = useState(false)

  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTagSuccess(null)

    if (!tagName.trim()) {
      toast.error('タグ名を入力してください')
      return
    }

    if (!selectedCategoryId) {
      toast.error('カテゴリを選択してください')
      return
    }

    setIsSubmittingTag(true)

    try {
      const result = await createTag(
        selectedCategoryId,
        tagName.trim(),
        tagDescription.trim() || undefined
      )

      if (isSuccess(result)) {
        setTagSuccess('タグを作成しました')
        setTagName('')
        setTagDescription('')
      } else {
        toast.error(result.error.message)
      }
    } catch {
      toast.error('タグの作成中にエラーが発生しました')
    } finally {
      setIsSubmittingTag(false)
    }
  }

  return (
    <form onSubmit={handleTagSubmit} className="space-y-4">
      <div>
        <label htmlFor="tag-category" className="block text-sm font-semibold text-neutral-900">
          カテゴリ <span className="text-red-500">*</span>
        </label>
        <Select
          id="tag-category"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="mt-2"
          disabled={isSubmittingTag}
        >
          {categories.length === 0 ? (
            <option value="">カテゴリがありません</option>
          ) : (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} {category.isSystem ? '(システム)' : ''}
              </option>
            ))
          )}
        </Select>
      </div>

      <div>
        <label htmlFor="tag-name" className="block text-sm font-semibold text-neutral-900">
          タグ名 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          id="tag-name"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="例: 和食、イタリアン、簡単"
          className="mt-2"
          size="xl"
          disabled={isSubmittingTag}
        />
      </div>

      <div>
        <label htmlFor="tag-description" className="block text-sm font-semibold text-neutral-900">
          説明（任意）
        </label>
        <Textarea
          id="tag-description"
          value={tagDescription}
          onChange={(e) => setTagDescription(e.target.value)}
          rows={3}
          placeholder="タグの説明を入力してください"
          className="mt-2"
          size="xl"
          disabled={isSubmittingTag}
        />
      </div>

      {tagSuccess && <Alert variant="success">{tagSuccess}</Alert>}

      <Button
        type="submit"
        disabled={categories.length === 0}
        isLoading={isSubmittingTag}
        size="lg"
        className="w-full"
      >
        <PlusIcon className="h-5 w-5" stroke="currentColor" />
        {isSubmittingTag ? '作成中...' : 'タグを作成'}
      </Button>
    </form>
  )
}

function CategoryForm() {
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categorySuccess, setCategorySuccess] = useState<string | null>(null)
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCategorySuccess(null)

    if (!categoryName.trim()) {
      toast.error('カテゴリ名を入力してください')
      return
    }

    setIsSubmittingCategory(true)

    try {
      const result = await createTagCategory(
        categoryName.trim(),
        categoryDescription.trim() || undefined
      )

      if (isSuccess(result)) {
        setCategorySuccess('カテゴリを作成しました')
        setCategoryName('')
        setCategoryDescription('')
      } else {
        toast.error(result.error.message)
      }
    } catch {
      toast.error('カテゴリの作成中にエラーが発生しました')
    } finally {
      setIsSubmittingCategory(false)
    }
  }

  return (
    <form onSubmit={handleCategorySubmit} className="space-y-4">
      <div>
        <label htmlFor="category-name" className="block text-sm font-semibold text-neutral-900">
          カテゴリ名 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          id="category-name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="例: 料理ジャンル、調理時間、難易度"
          className="mt-2"
          size="xl"
          disabled={isSubmittingCategory}
        />
      </div>

      <div>
        <label
          htmlFor="category-description"
          className="block text-sm font-semibold text-neutral-900"
        >
          説明（任意）
        </label>
        <Textarea
          id="category-description"
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
          rows={3}
          placeholder="カテゴリの説明を入力してください"
          className="mt-2"
          size="xl"
          disabled={isSubmittingCategory}
        />
      </div>

      {categorySuccess && <Alert variant="success">{categorySuccess}</Alert>}

      <Button type="submit" isLoading={isSubmittingCategory} size="lg" className="w-full">
        <PlusIcon className="h-5 w-5" stroke="currentColor" />
        {isSubmittingCategory ? '作成中...' : 'カテゴリを作成'}
      </Button>
    </form>
  )
}

export function TagCreateForm({ categories }: TagCreateFormProps) {
  const [activeTab, setActiveTab] = useState<'tag' | 'category'>('tag')

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md">
      {/* タブヘッダー */}
      <div className="border-b border-slate-200 bg-white">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('tag')}
            className={`group relative w-1/2 border-b-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'tag'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <TagIcon
                className={`h-5 w-5 ${activeTab === 'tag' ? 'text-emerald-600' : 'text-slate-400'}`}
              />
              タグを作成
            </span>
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`group relative w-1/2 border-b-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'category'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <FolderIcon
                className={`h-5 w-5 ${activeTab === 'category' ? 'text-emerald-600' : 'text-slate-400'}`}
              />
              カテゴリを作成
            </span>
          </button>
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="p-8">
        {activeTab === 'tag' ? (
          <TagForm categories={categories} />
        ) : (
          <CategoryForm />
        )}
      </div>
    </div>
  )
}
