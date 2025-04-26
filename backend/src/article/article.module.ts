import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@Module({
  imports: [JwtModule],
  providers: [ArticleService, JwtAuthGuard],
  controllers: [ArticleController],
})
export class ArticleModule {}
