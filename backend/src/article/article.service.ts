import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// DTOs
import { ArticleCreationDto } from './dto/article-creation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { isUUID } from 'class-validator';
import { Article, Category, UserCategoryScore } from '@prisma/client';

// Helpers
import { calcPopularityScore } from './helpers/article.helper';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Image validation
  useImageValidator(files: Array<Express.Multer.File>) {
    if (!files.length) {
      throw new HttpException(
        "Merci de fournir au minimum une image de l'article",
        HttpStatus.NOT_FOUND,
      );
    }

    if (files.length > 15) {
      throw new HttpException(
        "Vous avez dépassé la limite d'images par articles",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    //Are they pictures ?
    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        throw new HttpException(
          'Seuls les images sont autorisés',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }
    }
  }

  async create(
    article: ArticleCreationDto,
    images: Array<Express.Multer.File>,
    userId: string,
  ) {
    // Folder where images will be upload
    const folder = `articles/${userId}`;

    // Array for each image's url
    const imagesUrl: Array<string> = [];

    try {
      // Upload all images to Cloudinary
      const upload = images.map(async (image) => {
        // Upload
        const url: string = await this.cloudinaryService.uploadImage(
          image,
          folder,
        );

        // Store it
        imagesUrl.push(url);
      });

      // Wait for all images to be uploaded
      await Promise.all(upload);

      // Create article
      const newArticle = await this.prismaService.article.create({
        data: {
          name: article.name,
          description: article.description,
          price: parseFloat(article.price.toString()),
          coverImg: imagesUrl[0],
          userId,
          categoryId: article.categoryId,
        },
      });

      // Cover image is already save in article table
      imagesUrl.shift();

      // Store all images URL to database
      imagesUrl.forEach(async (imageUrl) => {
        await this.prismaService.articleImages.create({
          data: {
            image: imageUrl,
            articleId: newArticle.id,
          },
        });
      });
    } catch (err) {
      throw new HttpException(
        "Erreur lors de la création de l'article",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArticlesByUser(id: string) {
    try {
      // Fetch database
      return await this.prismaService.user.findFirst({
        where: { id },
        select: { articles: true },
      });
    } catch {
      throw new HttpException(
        'Erreur lors de la connexion au serveur',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateUserCategoryScore(
    categoryId: string,
    userId: string,
    incScore: number,
  ) {
    try {
      const update = await this.prismaService.userCategoryScore.upsert({
        where: { userId_categoryId: { userId, categoryId } },
        update: { score: { increment: incScore } },
        create: {
          userId,
          categoryId,
          score: incScore,
        },
      });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Erreur lors de la mise à jour du score',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCategoryByArticleID(articleId: string): Promise<string> {
    try {
      const category = await this.prismaService.article.findFirst({
        where: { id: articleId },
        select: { categoryId: true },
      });

      if (!category) {
        throw new HttpException(
          'Aucune catégorie trouvée pour cette article',
          HttpStatus.NOT_FOUND,
        );
      }

      return category.categoryId;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Erreur lors la récupération de la catégorie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async incrementArticleClick(articleId: string): Promise<void> {
    try {
      const article = await this.getArticleById(articleId);

      // Calculating popularity score
      const popularityScore = calcPopularityScore(
        article.clickCount + 1,
        article.likeCount,
      );

      await this.prismaService.article.update({
        where: { id: articleId },
        data: {
          clickCount: { increment: 1 },
          popularityScore: popularityScore,
        },
      });
    } catch {
      throw new HttpException(
        'Une erreur serveur est intervenue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async incrementArticleLike(articleId: string): Promise<void> {
    try {
      const article = await this.getArticleById(articleId);

      // Calculating popularity score
      const popularityScore = calcPopularityScore(
        article.clickCount,
        article.likeCount + 1,
      );

      await this.prismaService.article.update({
        where: { id: articleId },
        data: { likeCount: { increment: 1 }, popularityScore },
      });
    } catch {
      throw new HttpException(
        'Une erreur serveur est intervenue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArticleById(articleId: string): Promise<Article> {
    try {
      return await this.prismaService.article.findFirstOrThrow({
        where: { id: articleId },
      });
    } catch {
      throw new HttpException(
        'Une erreur serveur est intervenue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBestCategoriesForUser(userId: string): Promise<Array<any>> {
    // Get all categories ID
    try {
      const categoriesId = await this.prismaService.userCategoryScore.findMany({
        where: { userId: userId },
        select: { categoryId: true, score: true },
        orderBy: { score: 'desc' },
        take: 3,
      });

      return categoriesId;
    } catch {
      throw new HttpException(
        'Erreur lors de la récupération des articles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArticlesByCategoriesId(
    categoriesId: Array<UserCategoryScore>,
  ): Promise<Array<Article>> {
    try {
      const articlesNested: Article[][] = await Promise.all(
        categoriesId.map(async (category) => {
          const articles = await this.prismaService.article.findMany({
            where: { categoryId: category.categoryId },
            orderBy: { popularityScore: 'desc' },
            take: 3,
          });

          return articles; // pas besoin de vérifier s'ils existent ici
        }),
      );

      const articles: Article[] = articlesNested.flat(); // aplatit [[...], [...]] => [...]

      return articles;
    } catch {
      throw new HttpException(
        'Erreur lors de la récupération des articles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArticlesForUser(
    categoriesId: Array<UserCategoryScore>,
  ): Promise<Array<Article>> {
    try {
      const articlesNested: Article[][] = await Promise.all(
        categoriesId.map(async (category) => {
          const articles = await this.prismaService.article.findMany({
            where: { categoryId: category.categoryId },
            orderBy: { popularityScore: 'desc' },
            take: 3,
          });

          return articles; // pas besoin de vérifier s'ils existent ici
        }),
      );

      const allArticles: Article[] = articlesNested.flat(); // [[...], [...]] => [...]

      const uniqueArticlesMap = new Map<string, Article>();
      allArticles.forEach((article) => {
        uniqueArticlesMap.set(article.id, article);
      });

      let articles: Article[] = Array.from(uniqueArticlesMap.values());

      // User may not like any category, so articles will be empty or not full (3 articles per category = 9)
      if (articles.length < 9) {
        // So adding the rest (best articles per ratio)
        const limit = 9 - articles.length;
        const lastArticles: Article[] =
          await this.prismaService.article.findMany({
            orderBy: { popularityScore: 'desc' },
            take: limit,
            where: {
              // Excluding existing articles
              id: {
                notIn: articles.map((a) => a.id),
              },
            },
          });

        // Pushing new articles to list
        articles = [...articles, ...lastArticles];
      }

      if (!articles) {
        throw new HttpException(
          'Erreur lors de la récupération des articles',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return articles;
    } catch {
      throw new HttpException(
        'Erreur lors de la récupération des articles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isCategoryValid(id: string): Promise<Boolean> {
    if (!isUUID(id)) return false;

    // Checking category
    const category = await this.prismaService.category.findFirst({
      where: {
        id,
      },
    });

    if (category) {
      return true;
    }
    return false;
  }
}
