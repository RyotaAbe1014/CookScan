-- DropForeignKey
ALTER TABLE "recipe_tags" DROP CONSTRAINT "recipe_tags_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_tags" DROP CONSTRAINT "recipe_tags_tag_id_fkey";

-- AddForeignKey
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
