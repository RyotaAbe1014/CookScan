-- DropForeignKey
ALTER TABLE "tag_categories" DROP CONSTRAINT "tag_categories_user_id_fkey";

-- AlterTable
ALTER TABLE "tag_categories" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tag_categories" ADD CONSTRAINT "tag_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
