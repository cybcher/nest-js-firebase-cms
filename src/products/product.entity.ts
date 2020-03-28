import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ProductStatus } from './product-status.enum'

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 200 })
  title: string

  @Column('text')
  description: string

  @Column({ type: 'enum', enum: ProductStatus, nullable: false })
  status: ProductStatus

  @CreateDateColumn()
  created!: Date

  @UpdateDateColumn()
  updated!: Date
}
