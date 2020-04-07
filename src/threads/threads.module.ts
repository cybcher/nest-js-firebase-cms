import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { FireBase } from './core/firebase';
import { AuthModule } from '../auth/auth.module';
import { ThreadsService } from './threads.service';
import { ThreadRepository } from './thread.repository';
import { ThreadsController } from './threads.controller';
import { MessagesService } from '../messages/messages.service';
import { UserRepository } from '../users/user.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ThreadRepository,
      UserRepository,
    ])
  ],
  controllers: [ThreadsController],
  providers: [
    FireBase,
    ThreadsService, 
    MessagesService,
  ],
  exports: [ThreadsService],
})
export class ThreadsModule {}