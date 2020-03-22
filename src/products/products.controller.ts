import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { ProductsService } from './products.service'
import { Product } from './products.model'
import { CreateProductDto } from './dto/create-product.dto'

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(): Product[] {
    return this.productsService.getProducts();
  }

  @Get('/:id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto): Product {
    return this.productsService.createProduct(createProductDto);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProductById(id);
  }
}
