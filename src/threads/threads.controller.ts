import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { User } from '../users/user.entity';
import { ThreadsService } from './threads.service';
import { GetUser } from '../users/get-user.decorator';
import { Thread } from './thread.entity';

@Controller('threads')
@UseGuards(AuthGuard())
export class ThreadsController {

    constructor(
        private threadService: ThreadsService,
      ) {}

    @ApiCreatedResponse({
        description: 'Created. The thread has been successfully created. ',
        type: Thread
    })
    @ApiParam({ name: 'receiverId', type: Number, description: 'User ID that should receive your message', example: 1})
    @Post()
    createThread(@GetUser() sender: User, @Body('receiverId') receiverId: number): Promise<any> {
        return this.threadService.createThread(sender, receiverId)
    }

    @ApiCreatedResponse({
        description: 'Get all thread messages',
    })
    @Get('messages/:threadId')
    getMessage(@GetUser() sender: User, @Param('threadId') threadId: number): Promise<any> {
        return this.threadService.getMessages(threadId)
    }

    @ApiCreatedResponse({
        description: 'Add new message',
    })
    @Post('messages')
    addMessage(@GetUser() sender: User, @Body() messageBody: any): Promise<any> {
        return this.threadService.addMessage(messageBody.threadId, messageBody.value)
    }
}
