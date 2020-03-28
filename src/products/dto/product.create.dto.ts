import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
/* eslint-disable lines-between-class-members */
export class ProductCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;
}
