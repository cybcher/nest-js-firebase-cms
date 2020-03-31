import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'The `phone` number of the user',
    default: '380549858787',
    type: String,
  })
  phone: string
}
