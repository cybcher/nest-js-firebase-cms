import { ApiProperty } from '@nestjs/swagger'

import { MessageType } from '../../messages/message-type.enum'

export class ThreadAddMessageDto {
  @ApiProperty({
    name: 'value',
    description: 'Should be specified value of message or image name',
    example: 'text string or name of image',
  })
  value: string

  @ApiProperty({
    name: 'type',
    enum: MessageType,
    description:
      'Message type. <br /><br />Specific type of the message. Pick one from __Available values__',
    example: MessageType.TEXT,
  })
  type: MessageType
}
