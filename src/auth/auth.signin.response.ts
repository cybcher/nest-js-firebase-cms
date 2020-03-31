import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

export class AuthSignInResponse {
    @ApiProperty({
        description: 'The `accessToken` to be able to use other requests',
        default: '<token>',
        type: String,
    })
    accessToken: string

    @ApiProperty({
        description: 'The `user` object',
        type: User,
    })
    user: User
}