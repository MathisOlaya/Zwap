import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Usefull to store JWT TOKEN into Cookies
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
