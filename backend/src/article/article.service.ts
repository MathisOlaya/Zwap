import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// DTOs
import { ArticleCreationDto } from './dto/article-creation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

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
      console.error(err);
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
