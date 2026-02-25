-- CreateTable
CREATE TABLE "recipe_shares" (
    "id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "share_token" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipe_shares_recipe_id_key" ON "recipe_shares"("recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_shares_share_token_key" ON "recipe_shares"("share_token");

-- AddForeignKey
ALTER TABLE "recipe_shares" ADD CONSTRAINT "recipe_shares_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
