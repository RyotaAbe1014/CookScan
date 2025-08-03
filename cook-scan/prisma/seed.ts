import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // タグカテゴリとタグのデータ
  const tagData = {
    cuisine: {
      name: 'cuisine',
      description: '料理のジャンル',
      tags: ['和食', '洋食', '中華', '韓国', 'イタリアン', 'フレンチ', 'エスニック', 'その他']
    },
    course: {
      name: 'course',
      description: '料理のコース',
      tags: ['主菜', '副菜', '汁物', 'デザート', 'パン', '飲み物']
    },
    method: {
      name: 'method',
      description: '調理方法',
      tags: ['煮る', '焼く', '揚げる', '炒める', '蒸す', '和える', '漬ける', '茹でる']
    },
    ingredient_category: {
      name: 'ingredient_category',
      description: '食材のカテゴリ',
      tags: ['肉', '魚介', '野菜', '豆・豆腐', '米・穀類', '乳製品', '卵']
    },
    free: {
      name: 'free',
      description: 'フリータグ',
      tags: ['〆に最高', '作り置き可', '子供向け', '時短', 'ヘルシー', 'ボリューム満点', '節約']
    }
  }

  // タグカテゴリとタグを作成
  for (const [key, categoryData] of Object.entries(tagData)) {
    // カテゴリを作成
    const category = await prisma.tagCategory.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
        isSystem: true
      }
    })

    // カテゴリに属するタグを作成
    for (const tagName of categoryData.tags) {
      await prisma.tag.create({
        data: {
          categoryId: category.id,
          name: tagName,
          isSystem: true
        }
      })
    }
  }

  console.log('Seed data created successfully')
}

console.log('start seeding')
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    console.log('error seeding')
    process.exit(1)
  })

console.log('end seeding')
