import {
  Get,
  Body,
  Post,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiTags,
  ApiCreatedResponse,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { User } from './user.entity'
import { UsersService } from './users.service'
import { GetUser } from './get-user.decorator'
import { UserRepository } from './user.repository'
import { ThreadsService } from '../threads/threads.service'

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(
    private userService: UsersService,
    private threadService: ThreadsService,
    private userRepository: UserRepository,
  ) {}

  @ApiCreatedResponse({
    description:
      'Created. The `push_token` has been successfully saved as new `device`. ',
  })
  @ApiParam({
    name: 'push_token',
    type: String,
    description: 'Token that will be used as token to receive push messages',
    example: '******0j1o3nih9gejoniwne',
  })
  @Post('push')
  saveUserPushToken(
    @GetUser() user: User,
    @Body('push_token') pushToken: string,
  ): Promise<void> {
    return this.userService.addUserDevice(user.id, { pushToken })
  }

  @ApiResponse({
    description: 'Get User with list of devices',
    type: User,
  })
  @Get('push')
  getUserDevices(@GetUser() user: User): Promise<User> {
    return this.userService.getUserDevices(user)
  }

  @ApiResponse({
    description: 'Search and attach contacts to user',
    type: User,
  })
  @ApiQuery({
    name: 'contacts',
    type: Object,
    description: 'List of phone numbers that can be used as contacts',
    example: { contacts: ['658989239832', '9012909012'] },
  })
  // @UseInterceptors(ClassSerializerInterceptor)
  @Post('contacts')
  addToContacts(
    @GetUser() user: User,
    @Body('contacts') contacts: string[],
  ): Promise<User> {
    return this.userService.checkAndSaveUserContacts(contacts, user)
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('image'))
  async uploadedFile(@UploadedFile() file: any): Promise<any> {
    return true
  }
}
