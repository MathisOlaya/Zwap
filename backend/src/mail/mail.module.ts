import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

// Services
import { MailService } from './mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [MailService, PrismaService],
})
export class MailModule {}
