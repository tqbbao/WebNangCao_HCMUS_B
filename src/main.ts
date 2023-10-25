import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { LoggerServiceRotation } from './helpers/LoggerServiceRotation';
import { LoggerService } from './helpers/LoggerServiceWinston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalInterceptors(new LoggerInterceptor(new LoggerServiceRotation, new LoggerService));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({});
  const config = new DocumentBuilder()
    .setTitle('Sakila API')
    .setDescription('The sakila API description')
    .setVersion('1.0')
    .addTag('actor')
    .addTag('film')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
