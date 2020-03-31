import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as readPkg  from 'read-pkg-up';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('v1')
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //   }),
  // )

  // const pkg = await readPkg()

  const options = new DocumentBuilder()
    // .addBasicAuth()
    .setTitle("Karavanium Application")
    .setDescription('Karavanium Application')
    .setVersion("0.0.1")
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
