/*
  Warnings:

  - You are about to drop the column `parent_recipe_id` on the `recipes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_parent_recipe_id_fkey";

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "parent_recipe_id";

-- CreateTable
CREATE TABLE "recipe_relations" (
    "id" TEXT NOT NULL,
    "parent_recipe_id" TEXT NOT NULL,
    "child_recipe_id" TEXT NOT NULL,
    "quantity" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipe_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipe_relations_parent_recipe_id_child_recipe_id_key" ON "recipe_relations"("parent_recipe_id", "child_recipe_id");

-- AddForeignKey
ALTER TABLE "recipe_relations" ADD CONSTRAINT "recipe_relations_parent_recipe_id_fkey" FOREIGN KEY ("parent_recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_relations" ADD CONSTRAINT "recipe_relations_child_recipe_id_fkey" FOREIGN KEY ("child_recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
