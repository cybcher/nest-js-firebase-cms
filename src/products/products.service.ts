import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Product } from './product.entity'
import { ProductStatus } from './product-status.enum'
import { ProductRepository } from './product.repository'
import { ProductCreateDto } from './dto/product.create.dto'
import { GetProductsFilterDto } from './dto/get-products-filter.dto'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async getProducts(
    productsFilterDto: GetProductsFilterDto,
  ): Promise<Product[]> {
    return this.productRepository.getProducts(productsFilterDto)
  }

  async getProduct(id: number): Promise<Product> {
    const result = await this.productRepository.findOne(id)

    if (!result) {
      throw new NotFoundException(`Product with id: '${id}' not found`)
    }

    return result
  }

  async createProduct(createProductDto: ProductCreateDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto)
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Product with id: '${id}' not found`)
    }
  }

  async updateProductStatus(
    id: number,
    status: ProductStatus,
  ): Promise<Product> {
    const product = await this.getProduct(id)
    product.status = status
    await product.save()
    return product
  }
}
