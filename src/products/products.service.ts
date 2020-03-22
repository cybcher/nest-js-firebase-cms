import * as uuid from 'uuid/v1'
import { Injectable } from '@nestjs/common'
import { Product, ProductStatus } from './products.model'
import { CreateProductDto } from './dto/create-product.dto'

@Injectable()
export class ProductsService {
  private products: Product[] = []

  getProducts(): Product[] {
    return this.products
  }

  getProductById(id: string): Product | any {
    return this.products.find(task => task.id === id)
  }

  createProduct(createProductDto: CreateProductDto) {
    const { title, description } = createProductDto
    const product: Product = {
      id: uuid(),
      title,
      description,
      status: ProductStatus.ENABLED,
    }

    this.products.push(product)
    return product
  }

  deleteProductById(id: string): boolean {
    const productSizeBeforeOperation = this.products.length;
    this.products = this.products.filter(task => task.id !== id);

    return productSizeBeforeOperation !== this.products.length;
  }
}
