import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { credentialsMySQL } from '../config/types';

export const DbConfig = ({
    host,
    port,
    user,
    password,
    database,
  }: credentialsMySQL): TypeOrmModuleOptions => ({
    type: 'mysql',
    host,
    port,
    username: user,
    password,
    database,
    entities: [join(__dirname, './**/*.entity{.ts,.js}')],
  });