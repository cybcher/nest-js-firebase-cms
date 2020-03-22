import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from './products/products.module';
// import { DatabaseModule } from './database/database.module';

// import configuration from '../config/configuration';
// import { DbConfig } from './database/orm.config';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [configuration],
    // }),
    // TypeOrmModule.forRoot(DbConfig({} as any)),
    ProductsModule, 
    // DatabaseModule
  ],
})

export class AppModule {}
