import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
    private products = [];

    getProducts() {
        return this.products;
    }
}
