import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { JwtPayload } from './jwt-payload.interface'
import { UserRepository } from '../users/user.repository'
import configuration from '../config/configuration'

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

  async validate(payload: JwtPayload) {
    const { phone } = payload
    const user = await this.userRepository.findOne({ phone })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
