import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ArticleModule } from 'src/article/article.module';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [ArticleModule],
  providers: [CategoryService, PrismaService],
  controllers: [CategoryController],
})
export class CategoryModule {}
