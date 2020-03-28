/* eslint-disable lines-between-class-members */
import { ProductStatus } from '../product-status.enum';

export class ChangeProductStatusDto {
    id: string;
    status: ProductStatus;
}