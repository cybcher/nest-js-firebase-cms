import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken';

import { JwtPayload } from './jwt-payload.interface'
import { UserRepository } from '../users/user.repository'
import configuration from '../config/configuration'
import { User } from '../users/user.entity';

const authSecret = configuration().auth.secret

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    // todo: add secretkey from configuration file
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authSecret,
    })
  }

  async validate(payload: { phone: string }) {
    const { phone } = payload
    const user = await this.userRepository.findOne({ phone })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }

  async verify(accessToken: string): Promise<User | any> {
    const response: any = await jwt.verify(accessToken, authSecret);
    
    let user;
    if (response && typeof response !== "string") {
      user = await this.userRepository.findOne({ phone: response.phone })
    }

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
