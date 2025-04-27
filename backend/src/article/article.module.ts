import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [JwtModule, CloudinaryModule],
  providers: [ArticleService, JwtAuthGuard, PrismaService],
  controllers: [ArticleController],
})
export class ArticleModule {}
