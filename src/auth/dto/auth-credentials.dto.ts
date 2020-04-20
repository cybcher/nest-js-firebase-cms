import { ApiProperty } from '@nestjs/swagger'

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'The `uuid` id of the user in firebase database',
    default: 'lfAY********hAPdoH8Gbapn1',
    type: String,
  })
  uuid: string
}
