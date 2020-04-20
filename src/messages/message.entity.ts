import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { Thread } from '../threads/thread.entity'
import { MessageType } from './message-type.enum'

@Entity('messages')
export class Message extends BaseEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ enum: MessageType, default: MessageType.TEXT })
  @Column({
    type: 'enum',
    enum: MessageType,
    nullable: false,
    default: MessageType.TEXT,
  })
  type: MessageType

  // ALTER TABLE messages MODIFY COLUMN value VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
  @ApiProperty({ type: String, example: 'some example' })
  @Column({type: 'varchar', length: 255, nullable: false, charset: 'utf8', collation: 'utf8_general_ci' })
  value: string

  @ApiProperty({ type: Number, example: 1 })
  @Column({ type: Number })
  senderId: number

  @ApiProperty({ type: () => Thread })
  @ManyToOne(
    type => Thread,
    thread => thread.messages,
  )
  thread: Thread

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  created!: Date

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updated!: Date
}
