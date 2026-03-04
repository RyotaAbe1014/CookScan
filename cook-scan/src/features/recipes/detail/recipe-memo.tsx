import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { MemoIcon } from '@/components/icons/memo-icon'

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
        iconColor="secondary"
        title="メモ"
      />
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{memo}</p>
      </CardContent>
    </Card>
  )
}
