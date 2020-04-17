import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
    @ApiProperty({
        name: 'firstName',
        type: String,
        description: 'User first name (optional)',
        example: 'John',
    })
    firstName!: string;

    @ApiProperty({
        name: 'lastName',
        type: String,
        description: 'User last name (optional)',
        example: 'Jey',
    })
    lastName!: string;

    @ApiProperty({
        name: 'email',
        type: String,
        description: 'User email (optional)',
        example: 'john.jey@example.com',
    })
    email!: string;
}

