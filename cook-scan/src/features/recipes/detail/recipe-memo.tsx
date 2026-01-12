import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { MemoIcon } from '@/components/icons'

type RecipeMemoProps = {
  memo: string
}

export function RecipeMemo({ memo }: RecipeMemoProps) {
  return (
    <Card className="mb-6">
      <CardHeader
        icon={
          <MemoIcon className="h-5 w-5 text-white" />
        }
        iconColor="teal"
        title="メモ"
      />
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{memo}</p>
      </CardContent>
    </Card>
  )
}
