import {
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  UsePipes,
  UseGuards,
  Controller,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport';

import { Product } from './product.entity'
import { ProductsService } from './products.service'
import { ProductStatus } from './product-status.enum'
import { ProductCreateDto } from './dto/product.create.dto'
import { GetProductsFilterDto } from './dto/get-products-filter.dto'
import { ProductStatusValidationPipe } from './pipes/product-status-validation.pipe'

@ApiTags('Products')
// @ApiBearerAuth()
@Controller('products')
@UseGuards(AuthGuard())
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(
    @Query(ValidationPipe) productsFilterDto: GetProductsFilterDto,
  ): Promise<Product[]> {
    return this.productsService.getProducts(productsFilterDto)
  }

  @Get('/:id')
  getProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getProduct(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createProduct(@Body() createProductDto: ProductCreateDto): Promise<Product> {
    return this.productsService.createProduct(createProductDto)
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productsService.deleteProduct(id)
  }

  @Patch(':id/status')
  updateProductStatus(
    @Param('id') id: number,
    @Body('status', ProductStatusValidationPipe) status: ProductStatus,
  ): Promise<Product> {
    return this.productsService.updateProductStatus(id, status)
  }
}
