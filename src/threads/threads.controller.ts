import {
  Post,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Controller,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { Thread } from './thread.entity'
import { User } from '../users/user.entity'
import { ThreadDto } from './dto/thread.dto'
import { ThreadsService } from './threads.service'
import { GetUser } from '../users/get-user.decorator'
import { ThreadAddMessageDto } from './dto/thread-add-message.dto'

@ApiTags('Chat')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer <token here>',
})
@Controller('threads')
@UseGuards(AuthGuard())
export class ThreadsController {
  constructor(private threadService: ThreadsService) {}

  @ApiBody({
    type: ThreadDto,
    description: 'Click on `Schema` to see details 🔽',
  })
  @ApiOkResponse({
    description:
      '✔ Response includes the new `thread` or already existing one. <br /><br />By default: number of `messages` is `20` (_in case `load_new` is `true` there is no limitation for `messages`_).',
    type: Thread,
  })
  @Post('messages')
  @HttpCode(200)
  getMessage(
    @GetUser() sender: User,
    @Body() threadDto: ThreadDto,
  ): Promise<any> {
    return this.threadService.getMessages(sender, threadDto)
  }

  @ApiParam({
    name: 'id',
    description: 'Thread Id',
    type: Number,
  })
  @ApiBody({
    type: ThreadAddMessageDto,
    description: 'Click on `Schema` to see details 🔽',
  })
  @ApiCreatedResponse({
    description:
      '✔ Add new message and receive thread (will send push to both users)',
    type: Thread,
  })
  @Post(':id/messages')
  addMessage(
    @GetUser() sender: User,
    @Param('id') threadId: number,
    @Body() threadAddMessageDto: ThreadAddMessageDto,
  ): Promise<any> {
    return this.threadService.addMessage(sender, threadId, threadAddMessageDto)
  }
}
