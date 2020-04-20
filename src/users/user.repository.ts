import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './user.entity'
import { Device } from '../devices/device.entity'
import { UserDeviceDto } from './dto/user-device.dto'
import { UserContactsDto } from './dto/user-contacts.dto'
import { IsEmail } from 'class-validator'
import { UserProfileDto } from './dto/user-profile.dto'

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
      const fullUser = await this.getUserWithContacts(user.id)
      return user
    } catch (error) {
      if (error.errno === 1062 || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Phone already exists')
      }

      throw new InternalServerErrorException()
    }
  }

  async getUserByPhone(phone: string): Promise<User | any> {
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
      const fullUser = await this.getUserWithContacts(user.id)
      return fullUser
    }

    return null
  }

  async getProfile(user: User): Promise<User | any> {
    return this.getFullUser(user.id)
  }

  async updateProfile(
    user: User,
    profileData: UserProfileDto,
  ): Promise<User | any> {
    const { firstName, lastName, email } = profileData
    const fullUser = await this.getFullUser(user.id)
    if (!fullUser) {
      throw new NotFoundException('User not found')
    }

    fullUser.firstName = firstName || fullUser.firstName
    fullUser.lastName = lastName || fullUser.lastName
    fullUser.email = email || fullUser.email

    await fullUser.save()
    const loadSavedUser = await this.getFullUser(fullUser.id)
    return loadSavedUser
  }

  async saveAvatar(user: User, avatarUrl: string): Promise<User | any> {
    const fullUser = await this.getFullUser(user.id)
    if (!fullUser) {
      throw new NotFoundException('User not found')
    }

    fullUser.avatar = avatarUrl

    await fullUser.save()
    const loadSavedUser = await this.getFullUser(fullUser.id)
    return loadSavedUser
  }

  private async getAuthToken(phone: string, salt: string): Promise<string> {
    return bcrypt.hash(phone, salt)
  }

  async addUserDevice(id: number, userDeviceDto: UserDeviceDto): Promise<void> {
    const { push_token: pushToken } = userDeviceDto
    // console.log(params);
    let user
    try {
      user = await this.getFullUser(id)
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

    const device = new Device()
    device.token = pushToken
    user.devices.push(device)

    try {
      await user.save()
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async updateUserAvatar(id: number, params: any): Promise<void> {
    const { token } = params
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

    // user.pushToken = pushToken
    try {
      await user.save()
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async checkAndSaveUserContacts(
    user: User,
    userContactsDto: UserContactsDto,
  ): Promise<any> {
    const { contacts } = userContactsDto
    const fullUser = await this.getUserWithContacts(user.id)
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
    const savedUser = await this.getUserWithContacts(user.id)

    return savedUser
  }

  async getUserDevices(user: User): Promise<any> {
    const userWithDevices = await this.getUserWithDevices(user.id)
    if (!userWithDevices) {
      throw new InternalServerErrorException('User with such id not found')
    }

    return userWithDevices
  }

  async getActiveUserDeviceTokens(user: User): Promise<any> {
    const userWithDevices = await this.getUserWithDevices(user.id)
    if (!userWithDevices) {
      throw new InternalServerErrorException('User with such id not found')
    }

    const deviceTokens: any = []
    userWithDevices.devices.map(device => deviceTokens.push(device.token))
    return deviceTokens
  }

  async getUserWithContacts(id: number): Promise<User | undefined> {
    const user = await this.findOne(id, {
      relations: ['contacts'],
    })

    return user
  }

  async getUserWithContacting(id: number): Promise<User | undefined> {
    const user = await this.findOne(id, {
      relations: ['contacting'],
    })

    return user
  }

  async getUserWithDevices(id: number): Promise<User | undefined> {
    const user = await this.findOne(id, {
      relations: ['devices'],
    })

    return user
  }

  async getFullUser(id: number): Promise<User | undefined> {
    const user = await this.findOne(id, {
      relations: ['contacts', 'contacting', 'devices'],
    })

    return user
  }
}
