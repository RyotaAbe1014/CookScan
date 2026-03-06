-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "ocr_processing_history" DROP CONSTRAINT "ocr_processing_history_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_versions" DROP CONSTRAINT "recipe_versions_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "source_infos" DROP CONSTRAINT "source_infos_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "steps" DROP CONSTRAINT "steps_recipe_id_fkey";

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocr_processing_history" ADD CONSTRAINT "ocr_processing_history_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_versions" ADD CONSTRAINT "recipe_versions_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_infos" ADD CONSTRAINT "source_infos_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
