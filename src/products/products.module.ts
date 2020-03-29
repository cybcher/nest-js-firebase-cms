import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { ProductsService } from './products.service'
import { ProductRepository } from './product.repository'
import { ProductsController } from './products.controller'
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ProductRepository])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
