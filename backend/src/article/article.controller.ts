// Dependencies
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

// DTOs
import { ArticleCreationDto } from './dto/article-creation.dto';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

// Services
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  //Article creation
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async addArticle(
    @Body() article: ArticleCreationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @User('id') userId: string,
  ) {
    // Validate images from user
    this.articleService.useImageValidator(files);

    // Create
    await this.articleService.create(article, files, userId);
  }
}
