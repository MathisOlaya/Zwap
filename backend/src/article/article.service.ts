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
  }
}
