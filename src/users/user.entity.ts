import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  ManyToMany,
  JoinTable
} from 'typeorm'
import * as bcrypt from 'bcrypt'

import { UserRole } from './user-role.enum'

@Entity('users')
@Unique(['phone'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.CLIENT,
  })
  role: UserRole

  @Column({ type: 'varchar', length: 150, nullable: false })
  phone: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar!: string

  @Column({ type: 'varchar', length: 150, nullable: true })
  firstName!: string

  @Column({ type: 'varchar', length: 150, nullable: true })
  lastName!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  pushToken!: string
  
  @Column({ type: 'varchar', length: 255, nullable: false })
  salt: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  authToken: string

  @CreateDateColumn()
  created!: Date

  @UpdateDateColumn()
  updated!: Date

  @ManyToMany(type => User, user => user.contacting)
  @JoinTable()
  contacts: User[]

  @ManyToMany(type => User, user => user.contacts)
  contacting: User[];

  async validatePhone(phone: string): Promise<boolean> {
    const hash = await bcrypt.hash(phone, this.salt)

    return hash === this.authToken
  }
}
