import {
  Entity,
  Column,
  OneToMany,
  BaseEntity,
  RelationCount,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { User } from '../users/user.entity'
import { ThreadStatus } from './thread-status.enum'
import { Message } from '../messages/message.entity'

@Entity('threads')
@Unique(['firebaseDocId'])
export class Thread extends BaseEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 150, nullable: false })
  firebaseDocId: string

  @ApiProperty({ enum: ThreadStatus, default: ThreadStatus.ACTIVE })
  @Column({
    type: 'enum',
    enum: ThreadStatus,
    nullable: false,
    default: ThreadStatus.ACTIVE,
  })
  status: ThreadStatus

  @ManyToOne(
    type => User,
    sender => sender.threads,
  )
  sender: User

  @ManyToOne(
    type => User,
    receiver => receiver.threads,
  )
  receiver: User

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
