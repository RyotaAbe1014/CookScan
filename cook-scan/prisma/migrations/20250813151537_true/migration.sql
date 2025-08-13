/*
  Warnings:

  - You are about to drop the column `notes` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "notes",
ADD COLUMN     "memo" TEXT;
