import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { CookiesService } from './cookies/cookies.service';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { ArticleModule } from './article/article.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [AuthModule, MailModule, ArticleModule, CloudinaryModule, StripeModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, CookiesService],
})
export class AppModule {}
