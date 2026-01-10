import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Patch,
    HttpStatus,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import { RegisterDeviceDto } from './dto';
import { Auth, CurrentUser } from '@common/decorators';

@ApiTags('notifications')
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @Auth()
    @ApiOperation({ summary: 'Get user notifications' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of notifications',
    })
    async getNotifications(
        @CurrentUser('id') userId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.notificationsService.getUserNotifications(userId, page, limit);
    }

    @Patch(':id/read')
    @Auth()
    @ApiOperation({ summary: 'Mark notification as read' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Notification marked as read',
    })
    async markAsRead(
        @CurrentUser('id') userId: string,
        @Param('id') notificationId: string,
    ) {
        await this.notificationsService.markAsRead(notificationId, userId);
        return { success: true };
    }

    @Patch('read-all')
    @Auth()
    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'All notifications marked as read',
    })
    async markAllAsRead(@CurrentUser('id') userId: string) {
        await this.notificationsService.markAllAsRead(userId);
        return { success: true };
    }

    @Post('devices')
    @Auth()
    @ApiOperation({ summary: 'Register device for push notifications' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Device registered',
    })
    async registerDevice(
        @CurrentUser('id') userId: string,
        @Body() dto: RegisterDeviceDto,
    ) {
        return this.notificationsService.registerDevice(userId, dto);
    }

    @Delete('devices/:token')
    @Auth()
    @ApiOperation({ summary: 'Unregister device' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Device unregistered',
    })
    async unregisterDevice(
        @CurrentUser('id') userId: string,
        @Param('token') token: string,
    ) {
        await this.notificationsService.unregisterDevice(userId, token);
        return { success: true };
    }
}
