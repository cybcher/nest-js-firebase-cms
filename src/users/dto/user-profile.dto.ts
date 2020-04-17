import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
    @ApiProperty({
        name: 'first_name',
        type: String,
        description: 'User first name (optional)',
        example: 'John',
    })
    first_name!: string;

    @ApiProperty({
        name: 'last_name',
        type: String,
        description: 'User last name (optional)',
        example: 'Jey',
    })
    last_name!: string;

    @ApiProperty({
        name: 'email',
        type: String,
        description: 'User email (optional)',
        example: 'john.jey@example.com',
    })
    email!: string;
}

