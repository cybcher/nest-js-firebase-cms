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
import { AuthSignInResponse } from './auth.signin.response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async getToken(user: User): Promise<string>{
    const { phone } = user
    const payload = { phone }
    const accessToken = await this.jwtService.sign(payload)
    return accessToken;
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AuthSignInResponse> {
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

      let user = await this.userRepository.getUserByPhone(firebaseUserPhone)
      if (!user) {
        user = this.userRepository.createUser(firebaseUserPhone)
      }

      const accessToken = await this.getToken(user)
      const newObject: AuthSignInResponse = { accessToken, user }
      return newObject;
      // if we find user and no user in database, then save user and response with jwt token
    } catch (error) {
      throw new ConflictException(error.errorInfo.message)
    }
  }
}
