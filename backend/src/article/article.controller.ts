// Dependencies
import {
  Body,
  Controller,
  Post,
  Get,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus,
  Put,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

// DTOs
import { ArticleCreationDto } from './dto/article-creation.dto';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

// Services
import { ArticleService } from './article.service';
import { isUUID } from 'class-validator';

@Controller('articles')
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

    // Valid category
    if (!(await this.articleService.isCategoryValid(article.categoryId))) {
      throw new HttpException(
        "La catégorie sélectionnée n'existe pas",
        HttpStatus.NOT_FOUND,
      );
    }

    // Create
    await this.articleService.create(article, files, userId);
  }

  //Articles By USER
  @UseGuards(JwtAuthGuard)
  @Get()
  async getArticlesByUser(@User('id') id: string) {
    return await this.articleService.getArticlesByUser(id);
  }

  // Update user category score on click
  @UseGuards(JwtAuthGuard)
  @Put(':id/click')
  async registerClick(
    @Param('id') articleId: string,
    @User('id') userId: string,
  ) {
    // Is Valid ArticleID
    if (!isUUID(articleId)) {
      throw new HttpException(
        "L'article sélectionné n'est pas valide",
        HttpStatus.BAD_REQUEST,
      );
    }

    // Get Category id
    const categoryId =
      await this.articleService.getCategoryByArticleID(articleId);

    // Update user category score
    await this.articleService.updateUserCategoryScore(categoryId, userId, 1);

    // Update article click count
    await this.articleService.incrementArticleClick(articleId);
  }

  // Update user category score on like
  @UseGuards(JwtAuthGuard)
  @Put(':id/like')
  async registerLike(
    @Param('id') articleId: string,
    @User('id') userId: string,
  ) {
    // Is Valid ArticleID
    if (!isUUID(articleId)) {
      throw new HttpException(
        "L'article sélectionné n'est pas valide",
        HttpStatus.BAD_REQUEST,
      );
    }

    // Get Category id
    const categoryId =
      await this.articleService.getCategoryByArticleID(articleId);

    // Update user category score
    await this.articleService.updateUserCategoryScore(categoryId, userId, 3);

    // Update article like count
    await this.articleService.incrementArticleLike(articleId);
  }

  // Get Best Articles For User
  @UseGuards(JwtAuthGuard)
  @Get('/foryou')
  async articleRecommendation(@User('id') userId: string) {
    // Get best categories
    const categoriesID =
      await this.articleService.getBestCategoriesForUser(userId);

    // Fetching articles
    const articles = this.articleService.getArticlesForUser(categoriesID);

    return articles;
  }
}
