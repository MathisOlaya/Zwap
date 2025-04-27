-- DropForeignKey
ALTER TABLE "ArticleImages" DROP CONSTRAINT "ArticleImages_articleId_fkey";

-- AddForeignKey
ALTER TABLE "ArticleImages" ADD CONSTRAINT "ArticleImages_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
