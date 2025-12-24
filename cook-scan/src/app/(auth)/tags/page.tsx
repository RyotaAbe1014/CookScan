import { checkUserProfile } from '@/features/auth/auth-utils'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import { BackToDashboardLink } from '@/components/navigation/back-to-dashboard-link'
import { getTagCategoriesWithTags } from '@/features/tags/actions'
import { TagPageContent } from '@/features/tags/tag-page-content'

export default async function TagsPage() {
  const { profile } = await checkUserProfile()

  if (!profile) {
    return null
  }

  const { tagCategories } = await getTagCategoriesWithTags(profile.id)

  return (
    <AuthLayoutWrapper title="タグ管理" subtitle="レシピを整理・分類するタグを管理" rightAction={<BackToDashboardLink />}>
      <PageContainer>
        <TagPageContent tagCategories={tagCategories} currentUserId={profile.id} />
      </PageContainer>
    </AuthLayoutWrapper>
  )
}
