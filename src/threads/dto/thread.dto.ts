import { ApiProperty } from '@nestjs/swagger'
import { ThreadType } from '../thread-type.enum';
import { User } from '../../users/user.entity';

export class ThreadDto {
  @ApiProperty({
    name: 'receiver_id',
    type: Number,
    description: 'User `id` that should receive your message',
    example: 1,
  })
  receiver_id: number;

  @ApiProperty({
    name: 'last_message_id',
    type: Number,
    description: 'Latest `message_id` in device database',
    example: 30,
  })
  last_message_id: number;

  @ApiProperty({
    name: 'load_old',
    type: Boolean,
    description:
      'Scrolling __down__ 👇. <br />Load list of messages from specific point (should be specified `last_message_id` with latest `message_id` on your device). <br /><br />Pick `true` or `false`.',
    example: true,
  })
  load_old: boolean;

  @ApiProperty({
    name: 'load_new',
    type: Boolean,
    description:
      'Scrolling __up__ ☝. <br />Load list of messages from specific point (should be specified `last_message_id` with latest `message_id` on your device) or load full message history (`last_message_id` should be `0`). <br /><br />Pick `true` or `false`.',
    example: true,
  })
  load_new: boolean;

  @ApiProperty({
    name: 'type',
    enum: ThreadType,
    description:
      'Thread type. Specific theme of the chat. Pick one from __Available values__',
    example: ThreadType.REGULAR,
  })
  type: ThreadType;
}


// @GetUser() sender: User,