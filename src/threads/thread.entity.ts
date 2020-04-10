import {
  Entity,
  Column,
  Unique,
  OneToMany,
  ManyToOne,
  BaseEntity,
  RelationCount,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { ThreadType } from './thread-type.enum'
import { ThreadStatus } from './thread-status.enum'
import { User } from '../users/user.entity'
import { Message } from '../messages/message.entity'

@Entity('threads')
@Unique(['sender', 'receiver', 'type'])
export class Thread extends BaseEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ enum: ThreadType, default: ThreadType.REGULAR })
  @Column({
    type: 'enum',
    enum: ThreadType,
    nullable: false,
    default: ThreadType.REGULAR,
  })
  type: ThreadType

  @ApiProperty({ enum: ThreadStatus, default: ThreadStatus.ACTIVE })
  @Column({
    type: 'enum',
    enum: ThreadStatus,
    nullable: false,
    default: ThreadStatus.ACTIVE,
  })
  status: ThreadStatus

  @ApiProperty({ type: () => User })
  @ManyToOne(
    type => User,
    sender => sender.threads,
  )
  sender: User

  @ApiProperty({ type: () => User })
  @ManyToOne(
    type => User,
    receiver => receiver.threads,
  )
  receiver: User

  @ApiProperty({ type: [() => Message]})
  @OneToMany(
    type => Message,
    message => message.thread,
    { cascade: ['insert', 'update'] },
  )
  messages: Message[]

  @RelationCount((thread: Thread) => thread.messages)
  messagesCount: number

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  created!: Date

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updated!: Date
}
