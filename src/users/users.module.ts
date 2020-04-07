import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { ThreadsService } from '../threads/threads.service';
import { ThreadsModule } from '../threads/threads.module';
import { ThreadRepository } from '../threads/thread.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserRepository,
      ThreadRepository
    ])
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    ThreadsService
  ]
})
export class UsersModule {}
