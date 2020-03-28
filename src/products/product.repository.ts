import { Repository, EntityRepository, QueryBuilder } from 'typeorm'

import { Product } from './product.entity'
import { ProductStatus } from './product-status.enum'
import { ProductCreateDto } from './dto/product.create.dto'
import { GetProductsFilterDto } from './dto/get-products-filter.dto'

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async getProducts(
    productsFilterDto: GetProductsFilterDto,
  ): Promise<Product[]> {
    const { status, search } = productsFilterDto

    // const query = this.createQueryBuilder('product')
    // const result = await query.getMany()
    // return result
    const query = this.createQueryBuilder('products')
    if (status) {
      query.where('products.status =:status', { status })
    }

    if (search) {
      //
      query.andWhere(
        '(products.title LIKE :search OR products.description LIKE :search)',
        { search: `%${search}%` },
      )
    }

    const results = await query.getMany()
    return results
  }

  async createProduct(createProductDto: ProductCreateDto): Promise<Product> {
    const { title, description } = createProductDto

    const product = new Product()
    product.title = title
    product.description = description
    product.status = ProductStatus.ENABLED
    await product.save()

    return product
  }
}
