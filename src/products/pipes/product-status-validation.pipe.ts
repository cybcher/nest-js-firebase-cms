import {
  PipeTransform,
  BadRequestException,
} from '@nestjs/common'
import { ProductStatus } from '../product-status.enum'

export class ProductStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [ProductStatus.ENABLED, ProductStatus.DISABLED]

  transform(value: any) {
    value = value.toUpperCase()

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`Value of status: ${value} is incorrect`)
    }
    return value
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status)
    return idx !== -1
  }
}
