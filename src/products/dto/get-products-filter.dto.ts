import { IsOptional, IsIn, IsEmpty } from 'class-validator'
import { ProductStatus } from '../product-status.enum'

export class GetProductsFilterDto {
  @IsOptional()
  @IsIn([ProductStatus.DISABLED, ProductStatus.ENABLED])
  status: ProductStatus

  @IsOptional()
  search: string
}
