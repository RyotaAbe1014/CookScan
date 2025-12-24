import RecipeUploadContent from '@/features/recipes/upload/recipe-upload-content'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import { BackToDashboardLink } from '@/components/navigation/back-to-dashboard-link'

export default function RecipeUploadPage() {
  return (
    <AuthLayoutWrapper title="レシピをアップロード" subtitle="画像から自動抽出、または手動で入力" rightAction={<BackToDashboardLink />}>
      <PageContainer>
        <RecipeUploadContent />
      </PageContainer>
    </AuthLayoutWrapper>
  )
}
