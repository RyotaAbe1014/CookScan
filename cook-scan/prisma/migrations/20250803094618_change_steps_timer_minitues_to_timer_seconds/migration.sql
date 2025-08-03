/*
  Warnings:

  - You are about to drop the column `timer_minutes` on the `steps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "steps" DROP COLUMN "timer_minutes",
ADD COLUMN     "timer_seconds" INTEGER;
