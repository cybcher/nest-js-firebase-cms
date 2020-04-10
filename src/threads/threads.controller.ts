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

@ApiTags('Chat - Create/Receive Messages')
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
    description: 'User ID that should receive your message',
    example: 1,
  })
  @ApiQuery({
    name: 'last_message_id',
    type: Number,
    description: 'Last Message Id in device database',
    example: 30,
  })
  @ApiQuery({
    name: 'have_messages',
    type: Boolean,
    description: 'Device have cached messages?',
    example: true,
  })
  @ApiQuery({
    name: 'type',
    enum: ThreadType,
    description: 'Thread type',
    example: ThreadType.REGULAR,
  })
  @ApiOkResponse({
    description: 'You create thread or receive existence one',
    type: Thread
  })
  @Post('messages')
  @HttpCode(200)
  getMessage(
    @GetUser() sender: User,
    @Body('receiver_id') receiverId: number,
    @Body('last_message_id') lastMessageId: number,
    @Body('have_messages') haveMessages: boolean,
    @Body('type') threadType: ThreadType,
  ): Promise<any> {
    return this.threadService.getMessages(
      sender,
      receiverId,
      lastMessageId,
      haveMessages,
      threadType,
    )
  }

  @ApiCreatedResponse({
    description: 'Add new message',
  })
  @ApiParam({
    name: 'id',
    description: 'Thread Id',
    type: Number
  })
  @Post(':id/messages')
  addMessage(
    @GetUser() sender: User,
    @Param('id') threadId: number,
    @Body() messageBody: any,
  ): Promise<any> {
    return this.threadService.addMessage(threadId, messageBody.value)
  }
}
