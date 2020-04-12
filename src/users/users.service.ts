import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { User } from './user.entity'
import { UserDeviceDto } from './dto/user-device.dto'
import { UserContactsDto } from './dto/user-contacts.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  addUserDevice(id: number, userDeviceDto: UserDeviceDto): Promise<void> {
    return this.userRepository.addUserDevice(id, userDeviceDto)
  }

  checkAndSaveUserContacts(user: User, userContactsDto: UserContactsDto): Promise<User> {
    return this.userRepository.checkAndSaveUserContacts(user, userContactsDto)
  }

  getUserDevices(user: User): Promise<User> {
    return this.userRepository.getUserDevices(user)
  }
}
