import { Post, Body, Controller, ValidationPipe } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiTags,
} from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { AuthSignInResponse } from './auth.signin.response'

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @ApiCreatedResponse({
    description: 'Created. The user has been successfully authorized. ',
    type: AuthSignInResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid credentials. ',
  })
  @ApiConflictResponse({ description: 'Incorrect symbols in phone number. ' })
  signIn(
    @Body('uuid', ValidationPipe) userUUID: string,
  ): Promise<AuthSignInResponse> {
    return this.authService.signIn(userUUID)
  }
}
