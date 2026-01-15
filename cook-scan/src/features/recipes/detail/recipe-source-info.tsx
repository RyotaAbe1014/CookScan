import { Card, CardHeader, CardContent } from '@/components/ui/card'
import type { SourceInfoDisplay } from '@/types/sourceInfo'
import { isValidHttpUrl } from '@/utils/url-validation'
import { BookOpenIcon } from '@/components/icons/book-open-icon'
import { DocumentIcon } from '@/components/icons/document-icon'
import { LinkIcon } from '@/components/icons/link-icon'

type RecipeSourceInfoProps = {
  sourceInfo: SourceInfoDisplay
}

export function RecipeSourceInfo({ sourceInfo }: RecipeSourceInfoProps) {
  return (
    <Card className="mb-6">
      <CardHeader
        icon={
          <BookOpenIcon className="h-5 w-5 text-white" />
        }
        iconColor="amber"
        title="ソース情報"
      />
      <CardContent>
        <div className="space-y-3 text-sm">
          {sourceInfo.sourceName && (
            <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200">
              <BookOpenIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <span className="font-semibold text-gray-900">本の名前</span>
                <p className="mt-1 text-gray-600">{sourceInfo.sourceName}</p>
              </div>
            </div>
          )}
          {sourceInfo.pageNumber && (
            <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200">
              <DocumentIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <span className="font-semibold text-gray-900">ページ番号</span>
                <p className="mt-1 text-gray-600">{sourceInfo.pageNumber}</p>
              </div>
            </div>
          )}
          {sourceInfo.sourceUrl && (
            <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200">
              <LinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <div className="flex-1 overflow-hidden">
                <span className="font-semibold text-gray-900">参照URL</span>
                {isValidHttpUrl(sourceInfo.sourceUrl) ? (
                  <a
                    href={sourceInfo.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-emerald-600 transition-colors hover:text-indigo-700 hover:underline"
                  >
                    {sourceInfo.sourceUrl}
                  </a>
                ) : (
                  <p className="mt-1 truncate text-gray-600">{sourceInfo.sourceUrl}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
