import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://frontend:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Serve static files (videos)
  app.useStaticAssets(join(__dirname, '..', 'videos'), {
    prefix: '/videos/',
  });

  await app.listen(3001);
  console.log('🚀 Backend server running on http://localhost:3001');
  console.log('📊 GraphQL Playground: http://localhost:3001/graphql');
}
bootstrap();
