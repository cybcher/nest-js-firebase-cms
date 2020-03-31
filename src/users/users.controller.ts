import { Controller, Post, UseGuards, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'

import { UsersService } from './users.service'
import { GetUser } from './get-user.decorator'
import { User } from './user.entity'

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('push')
  saveUserPushToken(
    @GetUser() user: User,
    @Body('push_token') pushToken: string,
  ): Promise<void> {
    return this.userService.updateUserPushToken(user.id, { pushToken })
  }

  @Post('addcontact')
  addToContacts(
    @GetUser() user: User,
    @Body('contact_id') contactId: number,
  ): Promise<User> {
    return this.userService.addToContacts(contactId, user);
  }
}
