import { Controller, Post, Get, Body, UseGuards, Param, HttpCode } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { User } from '../users/user.entity'
import { ThreadsService } from './threads.service'
import { GetUser } from '../users/get-user.decorator'
import { Thread } from './thread.entity'
import { ThreadType } from './thread-type.enum'
import { MessageType } from '../messages/message-type.enum';

@ApiTags('Chat')
@ApiHeader({
    name: 'Authorization',
    description: 'Bearer <token here>',
  })
@Controller('threads')
@UseGuards(AuthGuard())
export class ThreadsController {
  constructor(private threadService: ThreadsService) {}

  @ApiQuery({
    name: 'receiver_id',
    type: Number,
    description: 'User `id` that should receive your message',
    example: 1,
  })
  @ApiQuery({
    name: 'last_message_id',
    type: Number,
    description: 'Latest `message_id` in device database',
    example: 30,
  })
  @ApiQuery({
    name: 'load_old',
    type: Boolean,
    description: "Scrolling __down__ 👇. <br />Load list of messages from specific point (should be specified `last_message_id` with latest `message_id` on your device). <br /><br />Pick `true` or `false`.",
    example: true,
  })
  @ApiQuery({
    name: 'load_new',
    type: Boolean,
    description: 'Scrolling __up__ ☝. <br />Load list of messages from specific point (should be specified `last_message_id` with latest `message_id` on your device) or load full message history (`last_message_id` should be `0`). <br /><br />Pick `true` or `false`.',
    example: true,
  })
  @ApiQuery({
    name: 'type',
    enum: ThreadType,
    description: 'Thread type. Specific theme of the chat. Pick one from __Available values__',
    example: ThreadType.REGULAR,
  })
  @ApiOkResponse({
    description: '✔ Response includes the new `thread` or already existing one. <br /><br />By default: number of `messages` is `20` (_in case `load_new` is `true` there is no limitation for `messages`_).',
    type: Thread
  })
  @Post('messages')
  @HttpCode(200)
  getMessage(
    @GetUser() sender: User,
    @Body('receiver_id') receiverId: number,
    @Body('last_message_id') lastMessageId: number,
    @Body('load_old') loadOldMessages: boolean,
    @Body('load_new') loadNewMessages: boolean,
    @Body('type') threadType: ThreadType,
  ): Promise<any> {
    return this.threadService.getMessages(
      sender,
      receiverId,
      lastMessageId,
      loadOldMessages,
      loadNewMessages,
      threadType,
    )
  }

  @ApiCreatedResponse({
    description: 'Add new message and receive thread',
    type: Thread
  })
  @ApiParam({
    name: 'id',
    description: 'Thread Id',
    type: Number
  })
  @ApiQuery({
    name: 'value',
    description: 'Should be specified value of message or image name',
    example: "text string or name of image",
  })
  @ApiQuery({
    name: 'type',
    enum: MessageType,
    description: 'Message type. <br /><br />Specific type of the message. Pick one from __Available values__',
    example: MessageType.TEXT,
  })
  @Post(':id/messages')
  addMessage(
    @GetUser() sender: User,
    @Param('id') threadId: number,
    @Body('type') messageType: MessageType,
    @Body('value') messageValue: string,
  ): Promise<any> {
    return this.threadService.addMessage(threadId, messageType, messageValue)
  }
}
