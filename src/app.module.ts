import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { DbConfig } from './database/orm.config'
import { UsersModule } from './users/users.module'
import configuration from './config/configuration'
import { DatabaseModule } from './database/database.module'
import { ProductsModule } from './products/products.module'

const mysqlConfig = configuration().db.mysql

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(DbConfig(mysqlConfig)),
    ProductsModule,
    UsersModule,
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
