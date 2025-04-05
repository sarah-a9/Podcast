import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  // Enable CORS for your frontend URL
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL (make sure this matches your frontend URL and port)
    methods: 'GET, POST, PUT, DELETE', // Specify allowed HTTP methods (adjust as needed)
    credentials: true, // Allow cookies if needed (set this to true if using cookies for authentication)
  });

  // Global validation pipe (your existing validation setup)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useStaticAssets(join(__dirname, '..', 'public'));


  // Listen on the specified port (defaults to 3000)
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
