import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

type RecipeImageSectionProps = {
  imageUrl: string
  title: string
}

export function RecipeImageSection({ imageUrl, title }: RecipeImageSectionProps) {
  return (
    <Card className="mb-6">
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
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
