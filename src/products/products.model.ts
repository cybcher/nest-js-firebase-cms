export interface Product {
  id: string
  title: string
  description: string
  status: ProductStatus
}

export enum ProductStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}
