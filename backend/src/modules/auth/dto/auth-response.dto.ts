import { ApiProperty } from '@nestjs/swagger';

export interface TokenPayload {
    sub: string;
    email: string;
}

class UserInfoDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;
}

export class AuthResponseDto {
    @ApiProperty({ type: UserInfoDto })
    user: UserInfoDto;

    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'JWT refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    refreshToken: string;
}
