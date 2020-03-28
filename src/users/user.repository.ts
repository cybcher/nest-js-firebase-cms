import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './user.entity'
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { phone } = authCredentialsDto
    const salt = await bcrypt.genSalt()

    const user = new User()
    user.phone = phone
    user.authToken = await this.getAuthToken(phone, salt)
    user.salt = salt

    try {
      await user.save()
    } catch (error) {
      if (error.errno === 1062 || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Phone already exists')
      }

      throw new InternalServerErrorException()
    }
  }

  async validateUserPhone(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string | any> {
    const { phone } = authCredentialsDto
    let user
    try {
      user = await this.findOne({ phone })
    } catch (error) {
      if (
        error.errno === 1267 ||
        error.code === 'ER_CANT_AGGREGATE_2COLLATIONS'
      ) {
        throw new ConflictException('Incorrect symbols in phone number')
      }

      throw new InternalServerErrorException()
    }

    if (user && (await user.validatePhone(phone))) {
      return user.phone
    }

    return null
  }

  private async getAuthToken(phone: string, salt: string): Promise<string> {
    return bcrypt.hash(phone, salt)
  }
}
