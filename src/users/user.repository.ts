import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './user.entity'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(phone: string): Promise<User> {
    const salt = await bcrypt.genSalt()

    const user = new User()
    user.phone = phone
    user.authToken = await this.getAuthToken(phone, salt)
    user.salt = salt

    try {
      await user.save()
      return user
    } catch (error) {
      if (error.errno === 1062 || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Phone already exists')
      }

      throw new InternalServerErrorException()
    }
  }

  async checkIfUserExists(
    phone: string,
  ): Promise<User | any> {
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
      return user;
    }

    return null
  }

  private async getAuthToken(phone: string, salt: string): Promise<string> {
    return bcrypt.hash(phone, salt)
  }

  async updateUserPushToken(id: number, params: any): Promise<void> {
    const { pushToken } = params;
    let user
    try {
      user = await this.findOne(id)
    } catch (error) {
      if (
        error.errno === 1267 ||
        error.code === 'ER_CANT_AGGREGATE_2COLLATIONS'
      ) {
        throw new ConflictException('Incorrect symbols in phone number')
      }

      throw new InternalServerErrorException()
    }

    if (!user) {
      throw new NotFoundException(`User with id: '${id}' not found`)
    }

    user.pushToken = pushToken
    try {
      await user.save()
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async addToContacts(contactId: number, user: User): Promise<User> {
    const contact = await this.findOne({id: contactId});
    if (contact) {
      user.contacting.push(
        contact
      );
      await user.save()
    }

    return user;
  }
}
