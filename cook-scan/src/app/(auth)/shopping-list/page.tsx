import { checkUserProfile } from '@/features/auth/auth-utils'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import { BackToDashboardLink } from '@/components/navigation/back-to-dashboard-link'
import { getShoppingItems } from '@/features/shopping-list/actions'
import { isSuccess } from '@/utils/result'
import { ShoppingListContent } from '@/features/shopping-list/components/shopping-list-content'

export default async function ShoppingListPage() {
  const { profile } = await checkUserProfile()

  if (!profile) {
    return null
  }

  const result = await getShoppingItems()
  const items = isSuccess(result) ? result.data : []

  return (
    <AuthLayoutWrapper
      title="買い物リスト"
      subtitle="必要な食材をチェック"
      rightAction={<BackToDashboardLink />}
    >
      <PageContainer>
        <ShoppingListContent items={items} />
      </PageContainer>
    </AuthLayoutWrapper>
  )
}
