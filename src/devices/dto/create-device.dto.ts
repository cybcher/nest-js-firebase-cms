import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateDeviceDto {
  @ApiProperty() readonly fcmToken: string

  @ApiPropertyOptional() readonly bundleId?: string
  
  @ApiProperty() readonly sandbox: boolean
}
