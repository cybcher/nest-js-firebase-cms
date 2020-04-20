import { ApiProperty } from '@nestjs/swagger'

export class UserAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any
}
