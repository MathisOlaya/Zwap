-- CreateTable
CREATE TABLE "UserCategoryScore" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "UserCategoryScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCategoryScore" ADD CONSTRAINT "UserCategoryScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCategoryScore" ADD CONSTRAINT "UserCategoryScore_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
