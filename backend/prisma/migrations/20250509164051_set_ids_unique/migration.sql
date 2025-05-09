/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserCategoryScore` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId]` on the table `UserCategoryScore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserCategoryScore_userId_key" ON "UserCategoryScore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCategoryScore_categoryId_key" ON "UserCategoryScore"("categoryId");
