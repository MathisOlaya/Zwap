/*
  Warnings:

  - Added the required column `coverImg` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "coverImg" TEXT NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "ArticleImages" (
    "id" UUID NOT NULL,
    "image" TEXT NOT NULL,
    "articleId" UUID NOT NULL,

    CONSTRAINT "ArticleImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImages" ADD CONSTRAINT "ArticleImages_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
