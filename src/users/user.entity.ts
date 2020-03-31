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
import { ApiProperty } from '@nestjs/swagger'

import { UserRole } from './user-role.enum'

@Entity('users')
@Unique(['phone'])
export class User extends BaseEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ enum: UserRole, default: UserRole.CLIENT })
  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.CLIENT,
  })
  role: UserRole

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 150, nullable: false })
  phone: string

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar!: string

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 150, nullable: true })
  firstName!: string

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 150, nullable: true })
  lastName!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  pushToken!: string
  
  @Column({ type: 'varchar', length: 255, nullable: false })
  salt: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  authToken: string

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  created!: Date

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updated!: Date

  @ApiProperty({ type: [User] })
  @ManyToMany(type => User, user => user.contacting)
  @JoinTable()
  contacts: User[]

  @ApiProperty({ type: [User] })
  @ManyToMany(type => User, user => user.contacts)
  contacting: User[];

  async validatePhone(phone: string): Promise<boolean> {
    const hash = await bcrypt.hash(phone, this.salt)

    return hash === this.authToken
  }
}
