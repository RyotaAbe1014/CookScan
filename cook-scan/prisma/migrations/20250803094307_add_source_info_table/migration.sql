/*
  Warnings:

  - You are about to drop the column `order_index` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `source_info` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `step_number` on the `steps` table. All the data in the column will be lost.
  - Added the required column `order_index` to the `steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "order_index";

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "source_info";

-- AlterTable
ALTER TABLE "steps" DROP COLUMN "step_number",
ADD COLUMN     "order_index" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "source_infos" (
    "id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "sourceType" TEXT,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "pageNumber" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "source_infos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "source_infos" ADD CONSTRAINT "source_infos_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
