import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { InfoCircleIcon } from '@/components/icons/info-circle-icon'
import { TagIcon } from '@/components/icons/tag-icon'
import { BookOpenIcon } from '@/components/icons/book-open-icon'
import { DocumentIcon } from '@/components/icons/document-icon'
import { LinkIcon } from '@/components/icons/link-icon'
import { DocumentTextIcon } from '@/components/icons/document-text-icon'
import type { SourceInfoFormData } from '@/types/forms'

type Props = {
  title: string
  onTitleChange: (value: string) => void
  sourceInfo: SourceInfoFormData
  onSourceInfoChange: (value: SourceInfoFormData) => void
  memo: string
  onMemoChange: (value: string) => void
}

export function BasicInfoSection({ title, onTitleChange, sourceInfo, onSourceInfoChange, memo, onMemoChange }: Props) {
  return (
    <Card>
      <CardHeader
        icon={<InfoCircleIcon className="h-5 w-5 text-white" />}
        iconColor="primary"
        title="基本情報"
      />
      <CardContent>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <TagIcon className="h-4 w-4 text-primary" />
              レシピタイトル <span className="text-danger">*</span>
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
              placeholder="美味しい料理の名前を入力"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="bookName"
                className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                <BookOpenIcon className="h-4 w-4 text-warning" />
                本の名前
              </label>
              <Input
                type="text"
                id="bookName"
                value={sourceInfo.bookName}
                onChange={(e) => onSourceInfoChange({ ...sourceInfo, bookName: e.target.value })}
                placeholder="料理本の名前"
              />
            </div>
            <div>
              <label
                htmlFor="pageNumber"
                className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                <DocumentIcon className="h-4 w-4 text-success" />
                ページ番号
              </label>
              <Input
                type="text"
                id="pageNumber"
                value={sourceInfo.pageNumber}
                onChange={(e) => onSourceInfoChange({ ...sourceInfo, pageNumber: e.target.value })}
                placeholder="P.123"
              />
            </div>
            <div>
              <label
                htmlFor="url"
                className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                <LinkIcon className="h-4 w-4 text-accent-steps" />
                参照URL
              </label>
              <Input
                type="url"
                id="url"
                value={sourceInfo.url}
                onChange={(e) => onSourceInfoChange({ ...sourceInfo, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="memo"
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <DocumentTextIcon className="h-4 w-4 text-secondary-hover" />
              メモ
            </label>
            <Textarea
              id="memo"
              value={memo}
              onChange={(e) => onMemoChange(e.target.value)}
              rows={3}
              placeholder="このレシピについてのメモや感想..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
