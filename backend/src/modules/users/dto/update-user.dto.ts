import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    googleId?: string;
}
