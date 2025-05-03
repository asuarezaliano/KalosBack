import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Kalos Backend');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  logger.log(`🚀 HTTP Server started on port ${port}`);
  logger.log(`📊 WebSocket Server started on port ${Number(port) + 1}`);
}
bootstrap();
