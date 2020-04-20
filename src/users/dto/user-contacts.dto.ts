import { ApiProperty } from '@nestjs/swagger';

export class UserContactsDto {
    @ApiProperty({
        name: 'contacts',
        type: String,
        isArray: true,
        description: 'List of phone numbers that can be used as contacts',
        example: ['658989239832', '9012909012'],
    })
    contacts: string[];
}

