
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

import { UserRole } from './user-role.enum'
import { Device } from '../devices/device.entity'
import { Thread } from '../threads/thread.entity'

@Entity('users')
@Unique(['phone'])
export class User extends BaseEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ enum: UserRole, default: UserRole.CLIENT, example: UserRole.CLIENT})
  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.CLIENT,
  })
  role: UserRole

  @ApiProperty({ type: String, example: '380958764576'})
  @Column({ type: 'varchar', length: 150, nullable: false })
  phone: string

  @ApiProperty({ type: String, example: 'example@example.com'})
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsEmail()
  email!: string

  @ApiProperty({ type: String, example: '/file/path/image.jpg'})
  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar!: string

  @ApiProperty({ type: String, example: 'John'})
  @Column({ type: 'varchar', length: 150, nullable: true })
  firstName!: string

  @ApiProperty({ type: String, example: 'Dou'})
  @Column({ type: 'varchar', length: 150, nullable: true })
  lastName!: string

  @ApiProperty({ type: String, example: 'qeiOGJ****qeqfG421'})
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude()
  salt: string

  @ApiProperty({ type: String, example: 'qeiOGJ****qeqfG421'})
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude()
  authToken: string

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  created!: Date

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updated!: Date

  @ApiProperty({ name: 'contacts', type: [User], isArray: true})
  @ManyToMany(
    type => User,
    user => user.contacting,
  )
  @JoinTable()
  contacts: User[]

  @ApiProperty({ name: 'contacting', type: [User], isArray: true})
  @ManyToMany(
    type => User,
    user => user.contacts,
  )
  contacting: User[]

  @ApiProperty({ type: [Device]})
  @OneToMany(
    type => Device,
    device => device.user,
    { cascade: ['insert', 'update'] },
  )
  devices: Device[]

  @ApiProperty({ type: [Thread]})
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

  async validatePhone(phone: string): Promise<boolean> {
    const hash = await bcrypt.hash(phone, this.salt)

    return hash === this.authToken
  }
}
