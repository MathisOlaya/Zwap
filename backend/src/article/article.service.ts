import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// DTOs
import { ArticleCreationDto } from './dto/article-creation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ArticleService {}
export class ArticleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

}
