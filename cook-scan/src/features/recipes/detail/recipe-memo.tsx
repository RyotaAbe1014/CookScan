import { Card, CardHeader, CardContent } from '@/components/ui/card'

type RecipeMemoProps = {
  memo: string
}

export function RecipeMemo({ memo }: RecipeMemoProps) {
  return (
    <Card className="mb-6">
      <CardHeader
        icon={
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        }
        iconColor="purple"
        title="メモ"
      />
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{memo}</p>
      </CardContent>
    </Card>
  )
}
