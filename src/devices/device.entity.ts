import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { User } from '../users/user.entity'

@Entity('devices')
@Unique(['token'])
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(
    type => User,
    user => user.devices,
  )
  user: User

  @Column({ type: 'varchar', length: 255 })
  token: string

  @CreateDateColumn()
  created!: Date

  @UpdateDateColumn()
  updated!: Date
}
