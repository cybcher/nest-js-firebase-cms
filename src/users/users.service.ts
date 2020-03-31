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

  updateUserPushToken(id: number, params: any): Promise<void> {
    return this.userRepository.updateUserPushToken(id, params)
  }

  addToContacts(contactId: number, user: User): Promise<User> {
    return this.userRepository.addToContacts(contactId, user)
  }
}
