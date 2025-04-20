import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

// Services
import { PrismaService } from 'src/prisma/prisma.service';
import { CookiesService } from 'src/cookies/cookies.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
    forwardRef(() => MailModule),
  ],
  providers: [AuthService, PrismaService, CookiesService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
