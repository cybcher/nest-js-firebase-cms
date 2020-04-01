import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import * as admin from 'firebase-admin'

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

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.firebaseSignIn(authCredentialsDto)
    const { phone } = user
    const payload = { phone }
    const accessToken = await this.jwtService.sign(payload)

    return { accessToken, user }
  }

  async firebaseSignIn(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { uuid } = authCredentialsDto
    let firebaseUser
    try {
      firebaseUser = await admin.auth().getUser(uuid)

      const firebaseUserPhone = firebaseUser.phoneNumber
      if (!firebaseUserPhone) {
        throw new ConflictException(
          'User phone not exists in firebase database',
        )
      }

      let user = await this.userRepository.checkIfUserExists(firebaseUserPhone)
      if (!user) {
        user = this.userRepository.createUser(firebaseUserPhone)
      }

      return user
      // if we find user and no user in database, then save user and response with jwt token
    } catch (error) {
      throw new ConflictException(error.errorInfo.message)
    }
  }
}
