import {
  Post,
  Body,
  Controller,
  ValidationPipe,
} from '@nestjs/common'

import { User } from '../users/user.entity';
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; user: User }> {
    this.authService.signUp(authCredentialsDto)
    return this.authService.signIn(authCredentialsDto)
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; user: User }> {
    return this.authService.signIn(authCredentialsDto)
  }
}
