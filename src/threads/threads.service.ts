import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { ThreadRepository } from './thread.repository'
import { Thread } from './thread.entity'
import { User } from '../users/user.entity'
import { Message } from '../messages/message.entity'
import { UserRepository } from '../users/user.repository'

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(ThreadRepository)
    private threadRepository: ThreadRepository,
    private userRepository: UserRepository,
  ) {}

  async createThread(sender: User, receiverId: number): Promise<Thread> {
    const receiver = await this.userRepository.getUserWithDevices(receiverId)
    const loadSender = await this.userRepository.getUserWithDevices(sender.id)

    if (!receiver || !loadSender) {
      throw new InternalServerErrorException()
    }

    const thread = await this.threadRepository.createThread(
      loadSender,
      receiver,
    )

    return thread
  }

  async addMessage(threadId: number, messageValue: string): Promise<any> {
    const message = new Message()
    message.value = messageValue
    const thread = await this.threadRepository.findThreadWithSenderAndReceiver(
      threadId,
    )
    if (!thread) {
      throw new InternalServerErrorException()
    }

    const receiverToken = await this.userRepository.getActiveUserDeviceToken(
      thread.receiver,
    )

    message.thread = thread
    const threadWithNewMessage = await this.threadRepository.addMessage(
      thread.id,
      message,
      receiverToken,
    )

    return threadWithNewMessage
  }

  async getMessages(threadId: number): Promise<any> {
    const thread = await this.threadRepository.findOne(
      threadId,
    )

    if (!thread) {
      throw new InternalServerErrorException()
    }

    const threadWithNewMessages = await this.threadRepository.getMessages(
      thread,
    )

    return threadWithNewMessages
  }
}
