import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'

import { Device } from './device.entity'
import { UserRepository } from '../users/user.repository'

@EntityRepository(Device)
export class DeviceRepository extends Repository<Device> {


  
}
