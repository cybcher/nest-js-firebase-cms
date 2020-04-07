import {
  Entity,
  Column,
  Unique,
  OneToMany,
  JoinTable,
  BaseEntity,
  ManyToMany,
  RelationCount,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import { IsEmail } from 'class-validator'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { Device } from '../devices/device.entity'
import { Thread } from '../threads/thread.entity'
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
  @IsEmail()
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

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude()
  salt: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude()
  authToken: string

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  created!: Date

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updated!: Date

  @ApiProperty({ type: [User] })
  @ManyToMany(
    type => User,
    user => user.contacting,
  )
  @JoinTable()
  contacts: User[]

  @ApiProperty({ type: [User] })
  @ManyToMany(
    type => User,
    user => user.contacts,
  )
  contacting: User[]

  @OneToMany(
    type => Device,
    device => device.user,
    { cascade: ['insert', 'update'] },
  )
  devices: Device[]

  @OneToMany(
    type => Thread,
    thread => thread.sender,
    { cascade: ['insert', 'update'] },
  )
  threads: Thread[]

  @Exclude()
  @RelationCount((user: User) => user.contacts)
  contactsCount: number

  @Exclude()
  @RelationCount((user: User) => user.contacting)
  contactingCount: number

  @Exclude()
  @RelationCount((user: User) => user.devices)
  devicesCount: number

  @Exclude()
  @RelationCount((user: User) => user.threads)
  threadCount: number

  async validatePhone(phone: string): Promise<boolean> {
    const hash = await bcrypt.hash(phone, this.salt)

    return hash === this.authToken
  }
}
