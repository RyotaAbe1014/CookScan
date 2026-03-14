import * as RecipeDevelopmentSessionRepository from '@/backend/repositories/recipe-development-session.repository'

export async function createRecipeDevelopmentSession(
  userId: string,
  threadId: string,
  title: string
) {
  return RecipeDevelopmentSessionRepository.createRecipeDevelopmentSession(
    userId,
    threadId,
    title
  )
}

export async function getRecipeDevelopmentSessionById(sessionId: string) {
  return RecipeDevelopmentSessionRepository.findRecipeDevelopmentSessionById(sessionId)
}

export async function getRecipeDevelopmentSessionList(userId: string) {
  return RecipeDevelopmentSessionRepository.findRecipeDevelopmentSessionsByUser(userId)
}

export async function deleteRecipeDevelopmentSession(sessionId: string) {
  return RecipeDevelopmentSessionRepository.deleteRecipeDevelopmentSession(sessionId)
}