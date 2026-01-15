import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { PhotographIcon } from '@/components/icons/photograph-icon'

type RecipeImageSectionProps = {
  imageUrl: string
  title: string
}

export function RecipeImageSection({ imageUrl, title }: RecipeImageSectionProps) {
  return (
    <Card className="mb-6">
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 shadow-md">
            <PhotographIcon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">レシピ画像</h3>
        </div>
        <Image
          src={imageUrl}
          alt={title}
          width={800}
          height={600}
          className="w-full rounded-xl object-cover shadow-md"
        />
      </CardContent>
    </Card>
  )
}
