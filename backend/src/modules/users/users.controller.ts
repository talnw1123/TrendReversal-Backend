import {
    Controller,
    Get,
    Patch,
    Body,
    HttpStatus,
    Post,
    Param,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Auth, CurrentUser } from '@common/decorators';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @Auth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User profile retrieved',
        type: UserResponseDto,
    })
    async getProfile(
        @CurrentUser('id') userId: string,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.getById(userId);
        return new UserResponseDto(user);
    }

    @Patch('me')
    @Auth()
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User profile updated',
        type: UserResponseDto,
    })
    async updateProfile(
        @CurrentUser('id') userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.update(userId, updateUserDto);
        return new UserResponseDto(user);
    }

    @Post('me/favorites/:symbol')
    @Auth()
    @ApiOperation({ summary: 'Add asset to favorites' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Asset added to favorites',
    })
    async addFavorite(
        @CurrentUser('id') userId: string,
        @Param('symbol') symbol: string,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.addFavoriteAsset(userId, symbol);
        return new UserResponseDto(user);
    }

    @Delete('me/favorites/:symbol')
    @Auth()
    @ApiOperation({ summary: 'Remove asset from favorites' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Asset removed from favorites',
    })
    async removeFavorite(
        @CurrentUser('id') userId: string,
        @Param('symbol') symbol: string,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.removeFavoriteAsset(userId, symbol);
        return new UserResponseDto(user);
    }
}
