import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './user.entity'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(phone: string): Promise<User | any> {
    const salt = await bcrypt.genSalt()

    const user = new User()
    user.phone = phone
    user.authToken = await this.getAuthToken(phone, salt)
    user.salt = salt

    try {
      await user.save()
      const fullUser = await this.getUserById(user.id)
      return user
    } catch (error) {
      if (error.errno === 1062 || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Phone already exists')
      }

      throw new InternalServerErrorException()
    }
  }

  async checkIfUserExists(phone: string): Promise<User | any> {
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
      const fullUser = await this.getUserById(user.id)
      return fullUser
    }

    return null
  }

  private async getAuthToken(phone: string, salt: string): Promise<string> {
    return bcrypt.hash(phone, salt)
  }

  async updateUserPushToken(id: number, params: any): Promise<void> {
    const { pushToken } = params
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

  async updateUserAvatar(id: number, params: any): Promise<void> {
    const { pushToken } = params
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

  async getUserById(id: number): Promise<User | undefined> {
    const user = await this.findOne(id, {
      relations: ['contacts', 'contacting'],
    })

    return user
  }

  async checkContacts(contacts: string[], user: User): Promise<any> {
    const fullUser = await this.getUserById(user.id)
    if (!fullUser) {
      throw new InternalServerErrorException('User with such id not found')
    }

    // eslint-disable-next-line no-restricted-syntax
    for (let phone of contacts) {
      // eslint-disable-next-line no-await-in-loop
      let contact = await this.findOne({ phone })
      if (contact) {
        fullUser.contacts.push(contact)
      }
    }

    await fullUser.save()
    const savedUser = await this.getUserById(user.id)

    return savedUser
  }
}
