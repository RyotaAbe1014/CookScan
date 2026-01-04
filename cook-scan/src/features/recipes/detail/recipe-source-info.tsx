import { Card, CardHeader, CardContent } from '@/components/ui/card'
import type { SourceInfoDisplay } from '@/types/sourceInfo'
import { isValidHttpUrl } from '@/utils/url-validation'

type RecipeSourceInfoProps = {
  sourceInfo: SourceInfoDisplay
}

export function RecipeSourceInfo({ sourceInfo }: RecipeSourceInfoProps) {
  return (
    <Card className="mb-6">
      <CardHeader
        icon={
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        }
        iconColor="amber"
        title="ソース情報"
      />
      <CardContent>
        <div className="space-y-3 text-sm">
          {sourceInfo.sourceName && (
            <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <div>
                <span className="font-semibold text-gray-900">本の名前</span>
                <p className="mt-1 text-gray-600">{sourceInfo.sourceName}</p>
              </div>
            </div>
          )}
          {sourceInfo.pageNumber && (
            <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <div>
                <span className="font-semibold text-gray-900">ページ番号</span>
                <p className="mt-1 text-gray-600">{sourceInfo.pageNumber}</p>
              </div>
            </div>
          )}
          {sourceInfo.sourceUrl && (
            <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <div className="flex-1 overflow-hidden">
                <span className="font-semibold text-gray-900">参照URL</span>
                {isValidHttpUrl(sourceInfo.sourceUrl) ? (
                  <a
                    href={sourceInfo.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
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
