import {
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'
import * as firebase from 'firebase-admin'

import { Thread } from './thread.entity'
import { User } from '../users/user.entity'
import { THREADS, MESSAGES } from '../utils'
import { Message } from '../messages/message.entity'

@EntityRepository(Thread)
export class ThreadRepository extends Repository<Thread> {
  private logger: Logger = new Logger('AppGateway')

  // todo: try to refactore firestore logic

  async createThread(sender: User, receiver: User): Promise<Thread> {
    const thread = new Thread()

    thread.firebaseDocId = `${sender.id}_${receiver.id}`
    thread.sender = sender
    thread.receiver = receiver

    const savedThread = await thread.save()
    await this.createFireStoreThread(savedThread, sender.id, receiver.id)

    const threadWith = this.findThreadWithSenderAndReceiver(savedThread.id)
    return threadWith
  }

  async addMessage(threadId: number, message: Message, token: string): Promise<any> {
    this.logger.log(`Start adding message to thread (id: ${threadId})`)
    let thread
    try {
      thread = await this.findThreadWithMessagesById(threadId)
    } catch (error) {
      throw new InternalServerErrorException()
    }

    thread.messages.push(message)
    await thread.save()
    this.logger.log(`Message added to thread (id: ${threadId})`)
    const newThread = await this.findThreadWithSenderAndReceiverAndMessages(thread.id)

    this.logger.log(`Message loaded again with thread (id: ${threadId})`)
    // todo fix loading of device token
    this.sendPushNotification("TEST MESSAGE", token)
    this.createFireStoreMessage(
      message,
      `${newThread.sender.id}_${newThread.receiver.id}`,
    )

    this.logger.log(`Message created! For thread (id: ${threadId})`)
    return newThread
  }

  async getMessages(thread: Thread): Promise<any> {
    let loadedThread
    try {
      loadedThread = await this.findThreadWithSenderAndReceiverAndMessages(thread.id)
      const messages = await this.getThreadMessages(loadedThread.firebaseDocId)
      return loadedThread
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // async deleteMessage(): Promise<Thread> {}

  async sendPushNotification(
    messageBody: string,
    recipientToken: string,
  ): Promise<any> {
    this.logger.log(`Start sending of push notification message to device (deviceToken: ${recipientToken})`)
    const message: firebase.messaging.Message = {
      data: {
        message: messageBody,
      },
      token: recipientToken,
    }

    try {
      this.logger.log(`Message for push notification sending is (message: ${JSON.stringify(message)})`)
      const response = await firebase.messaging().send(message)
      this.logger.log(
        `Finished creating. Response: ${JSON.stringify(response)}`,
      )

      return response
    } catch (error) {
      this.logger.error(`Catch some error. Error: ${JSON.stringify(error)}`)
      throw new InternalServerErrorException('Error sending message:', error)
    }
  }

  /** FIRESTORE PART */
  /**
   * Create Thread on FireStore
   *
   * @param thread
   * @param senderId
   * @param receiverId
   */
  async createFireStoreThread(
    thread: Thread,
    senderId: number,
    receiverId: number,
  ): Promise<any> {
    this.logger.log(
      `Start creating firestore thread for Users (senderId: ${senderId}, receiverId: ${receiverId})`,
    )
    try {
      const response = await firebase
        .firestore()
        .collection(THREADS)
        .doc(`${senderId}_${receiverId}`)
        .set({
          threadId: thread.id,
          senderId,
          receiverId,
          status: thread.status,
        })

      this.logger.log(
        `Finished creating. Response: ${JSON.stringify(response)}`,
      )
      return response
    } catch (error) {
      this.logger.error(`Catch some error. Error: ${JSON.stringify(error)}`)
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Update Thread on FireStore
   *
   * @param thread
   * @param senderId
   * @param receiverId
   */
  async updateFireStoreThread(
    thread: Thread,
    senderId: number,
    receiverId: number,
  ): Promise<any> {
    this.logger.log(
      `Start updating firestore thread for Users (senderId: ${senderId}, receiverId: ${receiverId})`,
    )
    try {
      const response = await firebase
        .firestore()
        .collection(THREADS)
        .doc(`${senderId}_${receiverId}`)
        .update({
          threadId: thread.id,
          senderId,
          receiverId,
          status: thread.status,
        })

      this.logger.log(
        `Finished updating. Response: ${JSON.stringify(response)}`,
      )
      return response
    } catch (error) {
      this.logger.error(`Catch some error. Error: ${JSON.stringify(error)}`)
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Delete Thread on FireStore
   *
   * @param firebaseDocId
   */
  async deleteFireStoreThread(firebaseDocId: string): Promise<any> {
    this.logger.log(
      `Start deleting firestore thread with DocId: ${firebaseDocId}`,
    )
    try {
      const response = await firebase
        .firestore()
        .collection(THREADS)
        .doc(firebaseDocId)
        .delete()

      this.logger.log(
        `Finished deleting. Response: ${JSON.stringify(response)}`,
      )
      return response
    } catch (error) {
      this.logger.error(`Catch some error. Error: ${JSON.stringify(error)}`)
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Create Message to Thread on FireStore
   *
   * @param thread
   * @param senderId
   * @param receiverId
   */
  async createFireStoreMessage(
    message: Message,
    firebaseDocId: string,
  ): Promise<any> {
    this.logger.log(
      `Start creating firestore thread message for Thread (firebaseDocId: ${firebaseDocId})`,
    )
    try {
      const response = await firebase
        .firestore()
        .collection(THREADS)
        .doc(firebaseDocId)
        .collection(MESSAGES)
        .doc(`${message.id}_${firebaseDocId}`)
        .set({
          messageId: message.id,
          messageType: message.type,
          created: message.created,
          updated: message.updated,
          value: message.value,
        })

      this.logger.log(
        `Finished creating. Response: ${JSON.stringify(response)}`,
      )
      return response
    } catch (error) {
      this.logger.error(`Catch some error. Error: ${JSON.stringify(error)}`)
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Update Message on FireStore
   *
   * @param thread
   * @param senderId
   * @param receiverId
   */
  async updateFireStoreMessage(
    message: Message,
    firebaseDocId: string,
  ): Promise<any> {
    this.logger.log(
      `Start updating firestore thread message for Thread (firebaseDocId: ${firebaseDocId})`,
    )
    try {
      const response = await firebase
        .firestore()
        .collection(THREADS)
        .doc(firebaseDocId)
        .collection(MESSAGES)
        .doc(`${message.id}_${firebaseDocId}`)
        .update({
          messageId: message.id,
          messageType: message.type,
          created: message.created,
          updated: message.updated,
          value: message.value,
        })

      this.logger.log(
        `Finished updating. Response: ${JSON.stringify(response)}`,
      )
      return response
    } catch (error) {
      this.logger.error(`Catch some error. Error: ${JSON.stringify(error)}`)
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Delete Message on FireStore
   *
   * @param messageId
   * @param firebaseDocId
   */
  async deleteThreadMessage(
    messageId: number,
    firebaseDocId: string,
  ): Promise<any> {
    this.logger.log(
      `Start deleting firestore thread message for Thread (firebaseDocId: ${firebaseDocId}, messageId: ${messageId}_${firebaseDocId})`,
    )
    try {
      const response = await firebase
        .firestore()
        .collection(THREADS)
        .doc(firebaseDocId)
        .collection(MESSAGES)
        .doc(`${messageId}_${firebaseDocId}`)
        .delete()

      this.logger.log(
        `Finished deleting. Response: ${JSON.stringify(response)}`,
      )
      return response
    } catch (error) {
      this.logger.error(`Catch some error. Error: ${JSON.stringify(error)}`)
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Get all thread messages
   *
   * @param firebaseDocId
   */
  async getThreadMessages(firebaseDocId: string): Promise<any> {
    this.logger.log(
      `Start retrieving all firestore thread messages (firebaseDocId: ${firebaseDocId})`,
    )
    try {
      const response = await firebase
        .firestore()
        .collection(THREADS)
        .doc(firebaseDocId)
        .collection(MESSAGES)
        .get()

      const messages = response.docs.map(doc => doc.data())
      this.logger.log(
        `Finished getting. Response: ${JSON.stringify(messages)}`,
      )

      return messages
    } catch (error) {
      this.logger.error(`Catch some error. Error: ${JSON.stringify(error)}`)
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Get latest thread messages
   *
   * @param firebaseDocId
   */
  async getLatestThreadMessages(
    firebaseDocId: string,
    lastMessageId: string,
  ): Promise<any> {
    this.logger.log(
      `Start retrieving all firestore thread messages (firebaseDocId: ${firebaseDocId})`,
    )
    try {
      const response = await firebase
        .firestore()
        .collection(THREADS)
        .doc(firebaseDocId)
        .collection(MESSAGES)
        .listDocuments()

      this.logger.log(
        `Finished creating. Response: ${JSON.stringify(response)}`,
      )
      return response
    } catch (error) {
      this.logger.error(`Catch some error. Error: ${JSON.stringify(error)}`)
      throw new InternalServerErrorException(error)
    }
  }

  async findThreadWithMessagesById(id: number): Promise<Thread> {
    const thread = await this.findOne(id, { relations: ['messages'] })
    if (!thread) {
      throw new NotFoundException('Thread does not exists')
    }

    return thread
  }

  async findThreadWithSenderAndReceiver(id: number): Promise<Thread> {
    const thread = await this.findOne(id, { relations: ['sender', 'receiver'] })
    if (!thread) {
      throw new NotFoundException('Thread does not exists')
    }

    return thread
  }

  async findThreadWithSenderAndReceiverAndMessages(id: number): Promise<Thread> {
    const thread = await this.findOne(id, { relations: ['sender', 'receiver', 'messages'] })
    if (!thread) {
      throw new NotFoundException('Thread does not exists')
    }

    return thread
  }
}
