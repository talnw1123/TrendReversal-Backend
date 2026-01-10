import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;
}
