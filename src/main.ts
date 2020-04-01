import * as admin from 'firebase-admin'
import { ServiceAccount, AppOptions } from "firebase-admin";
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

const adminConfig: ServiceAccount = {
  "projectId": "dealers-91777",
  "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDN0wmZTd/nz0Yb\nfWlLhb50egVPaK22kaCt32XTeOgAe8yFm6auIF75scut5JbnCR1S/sx1fhcY7fMb\n9444RqsPBYYav3w5ntQ82h65KipUFnDAj5cTvxJJU65abtFj6tpnmAciECyn6xJx\n3kEofpZdKi5cvJNIcF0a+R5iZuRUbVKQtYrWyFmK7ZeXpNIwHXYyQyWbS8XX3PnY\nwPR48+JT4NI/7nOPyTZLQhthkp34dAtIKimuEdYj8gPL/jaqGpWcGRd+oJozmAA4\nj0zknLrw2DMOjKggEE5Cf45zoNT4ryXqYnz573hi/v3ICAUn2vm6UmgbVTvR4kRn\nbPeKAsVVAgMBAAECggEABk8DYo5LQF7vSmzp4w12pLnPu1sdRfUJPIMWKyjvzYH9\n5xN6BKjL2HHtaQdSY8L5Ad/68tf6S8KRWshX9Nwfpp53+Y5od5ipbzMNUYYcFYc5\njgFos0t+Oz6kH7P5WYtrhdTYVSAzSjNPlatnCl906uad1KxYBFajV+4OUxxNv9Oq\n4SSte1SkT/e/zYRGISlyrR5a1/7g4kbIrAjkbuaKEZ2Pjg4uJBSYneTPPiN/GhwS\nhfqOg8iy9vgiiPVI4t98kfsYHA4cUJ9lfXIHsXScjKBrQLo828b/g+tiDJfSi9Nw\nNnIDM9TS5bBY4dCSi+EK/9S8Vq25cMK11zAFyOh5UQKBgQD3uPMD7rlG1lYJa4jC\n+TCENvvrITZzfFupCEMdKn6g4FjPjJZ4ujiFg8h5SbFr+P6AN90hIjbigsgphOtt\nwq9HBO7VFzYjAm6sR2cCT0uKwLfg29lU3bSA7a4YOGlRBN+6ywInZetgblRWCfq9\nsx3gsevNLZ3Pc+kwdnejBnCc8QKBgQDUs6+2mcsgxhuE9mopuxLQ9yoMhWW4rImC\nquNKEBw9tDEa3jK1sgKppMnPFkm7LRfbJ5zYVGP7/Mgq34R7t60jZENCKXNnMzy/\nnoInB1bb2r5txUrX5JxxGvjoxfRNvRNfSQVy8RPV4A2zaiMGmA+JY67wY8CFMDvY\nR4JZRR9+pQKBgAEVt0K6JeeQgrnx1Zx8+OBrWTkTYSiqT8Byv9B94iYUNW9bP0Fy\nF1NGW3dkgjll0r9+/yHpA3KEfhnocht98cSO2fjm7B7FIPTyLxpMfJkz9NowPEhp\n3COAZvXGMXfgXJZ10yGXCavXb9kcnBN+mE/ml5DDdWB2Mnw62JVHLvERAoGBAJV/\noh4W5IWpmIgQ5jdkjGohfwWD8SYm5xPXZp+UyTS5ZNY8nKnGb0arU0jhonsTy7O2\nmPAYCJqBZnNz3NtUEzZP71IebkV35tfL4jDqYKtwiO4AgIVT4n1A9vgswnStU2Ni\noJjURxvJOfgDvpCQ6kKntLqzcgprB3URddWm1ucdAoGANhdNjvTKvmMwOSFeOQd1\nnjBhX5rQAgM9yYu03wrvg2qfjQhz+gAeDxdb38xNUTNxM1emHvunaL5txsvEw/k3\nKE3WQy65BTP6iFsllSx8ZRRqgo2E0GvdlzK5y6SXpd/20uDVwcjNVjFQgLhUT9Zf\nvtzx3P77urNHfbgrQKeWc8Y=\n-----END PRIVATE KEY-----\n",
  "clientEmail": "dealers-91777@appspot.gserviceaccount.com",
};

const firebaseConfig: AppOptions = {
  credential: admin.credential.cert({
    projectId: adminConfig.projectId,
    privateKey: adminConfig.privateKey,
    clientEmail: adminConfig.clientEmail,
  }),
  databaseURL: 'https://dealers-91777.firebaseio.com',
}

async function bootstrap() {
  admin.initializeApp(firebaseConfig)
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('v1')
  const options = new DocumentBuilder()
    // .addBasicAuth()
    .setTitle('Karavanium Application')
    .setDescription('Karavanium Application')
    .setVersion('0.0.1')
    .addTag('API')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)

  await app.listen(3000)
}
bootstrap()
