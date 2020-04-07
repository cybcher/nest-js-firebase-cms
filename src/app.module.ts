import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'

import configuration from './config/configuration'

import { AuthModule } from './auth/auth.module'
import { DbConfig } from './database/orm.config'
import { UsersModule } from './users/users.module'
import { ThreadsModule } from './threads/threads.module'
import { DevicesModule } from './devices/devices.module'
import { MessagesModule } from './messages/messages.module'
import { ProductsModule } from './products/products.module'
import { DatabaseModule } from './database/database.module'

const mysqlConfig = configuration().db.mysql

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(DbConfig(mysqlConfig)),
    AuthModule,
    UsersModule,
    ThreadsModule,
    DevicesModule,
    MessagesModule,
    DatabaseModule,
    ProductsModule,
  ],
})
export class AppModule {}
