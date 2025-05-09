/*
  Warnings:

  - A unique constraint covering the columns `[userId,categoryId]` on the table `UserCategoryScore` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserCategoryScore_categoryId_key";

-- DropIndex
DROP INDEX "UserCategoryScore_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserCategoryScore_userId_categoryId_key" ON "UserCategoryScore"("userId", "categoryId");
