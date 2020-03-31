import { Post, Body, Controller, ValidationPipe } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiTags,
} from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { AuthSignInResponse } from './auth.signin.response'

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiCreatedResponse({
    description: 'Created. The user has been successfully created. ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid credentials. ',
  })
  @ApiConflictResponse({ description: 'Incorrect symbols in phone number. ' })
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto)
  }

  @Post('/signin')
  @ApiCreatedResponse({
    description: 'Created. The user has been successfully authorized. ',
    type: AuthSignInResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid credentials. ',
  })
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthSignInResponse> {
    return this.authService.signIn(authCredentialsDto)
  }
}
