import { ApiProperty } from '@nestjs/swagger';

export class UserDeviceDto {
    @ApiProperty({
        name: 'push_token',
        type: String,
        description: 'Token that will be used as token to receive push messages',
        example: '******0j1o3nih9gejoniwne',
    })
    push_token: string;
}