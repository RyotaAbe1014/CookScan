/*
  Warnings:

  - A unique constraint covering the columns `[threadId]` on the table `RecipeDevelopmentSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RecipeDevelopmentSession_threadId_key" ON "RecipeDevelopmentSession"("threadId");
