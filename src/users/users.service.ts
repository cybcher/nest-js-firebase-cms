import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  addUserDevice(id: number, params: any): Promise<void> {
    return this.userRepository.addUserDevice(id, params)
  }

  checkAndSaveUserContacts(contacts: string[], user: User): Promise<User> {
    return this.userRepository.checkAndSaveUserContacts(contacts, user)
  }

  getUserDevices(user: User): Promise<User> {
    return this.userRepository.getUserDevices(user)
  }
}
