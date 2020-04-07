import * as admin from 'firebase-admin'
import { AppOptions } from "firebase-admin";
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import configuration from './config/configuration'

const firebaseConfiguration = configuration().firebase

const firebaseConfig: AppOptions = {
  credential: admin.credential.cert({
    projectId: firebaseConfiguration.projectId,
    privateKey: firebaseConfiguration.privateKey,
    clientEmail: firebaseConfiguration.clientEmail,
  }),
  databaseURL: firebaseConfiguration.databaseURL,
}

async function bootstrap() {
  const appOptions = {cors: true}
  admin.initializeApp(firebaseConfig)
  const app = await NestFactory.create(AppModule, appOptions)
  app.setGlobalPrefix('v1')

  const options = new DocumentBuilder()
    .setTitle('Karavanium Application')
    .setDescription('Karavanium Application')
    .setVersion('0.0.1')
    .addTag('API')
    // .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)

  await app.listen(3000)
}
bootstrap()
