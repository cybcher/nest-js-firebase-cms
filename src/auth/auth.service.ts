import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { UserRepository } from '../users/user.repository'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { User } from '../users/user.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto)
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.userRepository.validateUserPhone(authCredentialsDto)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const { phone } = user
    const payload = { phone }
    const accessToken = await this.jwtService.sign(payload)

    return { accessToken, user }
  }
}
