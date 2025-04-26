// Dependencies
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

// DTOs
import { ArticleCreationDto } from './dto/article-creation.dto';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@Controller('article')
export class ArticleController {
  //Article creation
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async addArticle(
    @Body() article: ArticleCreationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files.length) {
      throw new HttpException(
        "Merci de fournir au minimum une image de l'article",
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
