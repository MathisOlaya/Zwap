import { Controller, Get } from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';

// Services
import { ArticleService } from 'src/article/article.service';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
  ) {}
  @Get('/foryou')
  async getFavoritesUserCategories(@User('id') userId: string) {
    // Get BEST categories
    const categoriesID =
      await this.articleService.getBestCategoriesForUser(userId);

    const categories =
      await this.categoryService.getCategoriesInfo(categoriesID);

    return categories;
  }
}
