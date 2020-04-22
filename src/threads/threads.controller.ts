import {
  Res,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiConsumes,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { extname } from 'path'
import { diskStorage } from 'multer'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'

import { Thread } from './thread.entity'
import { User } from '../users/user.entity'
import { ThreadDto } from './dto/thread.dto'
import { ThreadsService } from './threads.service'
import { GetUser } from '../users/get-user.decorator'
import { MessageType } from '../messages/message-type.enum';
import { ThreadAddMessageDto } from './dto/thread-add-message.dto'

@ApiTags('Chat')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer <token here>',
})
@Controller('threads')
@UseGuards(AuthGuard())
export class ThreadsController {
  SERVER_URL = 'http://161.35.20.152:3000/'

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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: Object,
  })
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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/chat',

        filename: (req: any, file: any, cb: any) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  addMessage(
    @GetUser() sender: User,
    @UploadedFile() file: any,
    @Param('id') threadId: number,
    @Body() threadAddMessageDto: ThreadAddMessageDto,
  ): Promise<any> {
    const { type: messageType } = threadAddMessageDto
    if (messageType === MessageType.IMAGE) {
      return this.threadService.saveFile(sender, threadId, threadAddMessageDto, `${this.SERVER_URL}v1/threads/message/file/${file.filename}`)
    }

    return this.threadService.addMessage(sender, threadId, threadAddMessageDto)
  }

  @ApiParam({
    name: "fileName",
    description: "File name"
  })
  @ApiOkResponse({
    description: 'File'
  })
  @Get('messages/file/:fileName')
  async downloadFile(
    @GetUser() user: User,
    @Res() res: any,
    @Param('fileName') fileName: string,
  ): Promise<any> {
    res.setHeader("Content-Type", "image/jpeg")
    res.attachment(`./files/chat/${fileName}`)
    return res.download(`./files/chat/${fileName}`)
  }
}
