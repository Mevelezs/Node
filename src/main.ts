import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //quita o ignora los elemntos que no esten definidos en el dto
      forbidNonWhitelisted: true, // Alerta sobre el dato extra en el dto y deniega la petición
    }),
  ); // activa los validadores (DTOs) globalmente

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Start API whit nestjs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
