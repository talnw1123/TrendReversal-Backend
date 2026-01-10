import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'User password (min 6 characters)',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'User full name',
    })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;
}
