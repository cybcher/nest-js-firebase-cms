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
  ApiBody,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { User } from './user.entity'
import { UsersService } from './users.service'
import { GetUser } from './get-user.decorator'
import { UserRepository } from './user.repository'
import { ThreadsService } from '../threads/threads.service'
import { UserDeviceDto } from './dto/user-device.dto';
import { UserContactsDto } from './dto/user-contacts.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(
    private userService: UsersService,
    private threadService: ThreadsService,
    private userRepository: UserRepository,
  ) {}

  @ApiBody({
    type: UserDeviceDto,
    description: 'Click on `Schema` to see details 🔽',
  })
  @ApiCreatedResponse({
    description:
      'Created. The `push_token` has been successfully saved as new `device`. ',
  })
  @Post('push')
  saveUserDevice(
    @GetUser() user: User,
    @Body() userDeviceDto: UserDeviceDto,
  ): Promise<void> {
    return this.userService.addUserDevice(user.id, userDeviceDto)
  }

  @ApiResponse({
    description: 'Get User with list of devices',
    type: User,
  })
  @Get('push')
  getUserDevices(@GetUser() user: User): Promise<User> {
    return this.userService.getUserDevices(user)
  }

  @ApiBody({
    type: UserContactsDto,
    description: 'Click on `Schema` to see details 🔽',
  })
  @ApiResponse({
    description: 'Search and attach contacts to user',
    type: User,
  })
  @Post('contacts')
  addToContacts(
    @GetUser() user: User,
    @Body() userContactsDto: UserContactsDto,
  ): Promise<User> {
    return this.userService.checkAndSaveUserContacts(user, userContactsDto)
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('image'))
  async uploadedFile(@UploadedFile() file: any): Promise<any> {
    return true
  }
}
