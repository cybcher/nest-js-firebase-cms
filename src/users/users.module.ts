import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
