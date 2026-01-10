import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from '../entities/user.entity';

@Exclude()
export class UserResponseDto {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    email: string;

    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty({ required: false })
    avatar?: string;

    @Expose()
    @ApiProperty({ required: false })
    preferences?: {
        notifications: boolean;
        favoriteAssets: string[];
    };

    @Expose()
    @ApiProperty()
    createdAt: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
