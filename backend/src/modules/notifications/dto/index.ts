import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';
import { DevicePlatform } from '../entities/device-token.entity';

export class CreateNotificationDto {
    @IsString()
    userId: string;

    @IsEnum(NotificationType)
    type: NotificationType;

    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsOptional()
    data?: {
        symbol?: string;
        reversalType?: string;
        price?: number;
        confidence?: number;
    };
}

export class RegisterDeviceDto {
    @ApiProperty({
        description: 'Device push token (FCM or APNs)',
        example: 'fcm_token_here',
    })
    @IsString()
    token: string;

    @ApiProperty({
        enum: DevicePlatform,
        description: 'Device platform',
        example: DevicePlatform.ANDROID,
    })
    @IsEnum(DevicePlatform)
    platform: DevicePlatform;

    @ApiProperty({
        required: false,
        description: 'Device name',
        example: 'iPhone 15 Pro',
    })
    @IsString()
    @IsOptional()
    deviceName?: string;
}
