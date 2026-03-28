-- CreateTable
CREATE TABLE "RecipeDevelopmentSession" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeDevelopmentSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeDevelopmentSession" ADD CONSTRAINT "RecipeDevelopmentSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
