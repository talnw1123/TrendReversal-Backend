import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification, NotificationType } from './entities/notification.entity';
import { DeviceToken, DevicePlatform } from './entities/device-token.entity';
import { CreateNotificationDto, RegisterDeviceDto } from './dto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        @InjectRepository(DeviceToken)
        private readonly deviceTokenRepository: Repository<DeviceToken>,
    ) { }

    /**
     * Create and save a notification
     */
    async create(dto: CreateNotificationDto): Promise<Notification> {
        const notification = this.notificationRepository.create(dto);
        return this.notificationRepository.save(notification);
    }

    /**
     * Send reversal alert notification
     */
    async sendReversalAlert(
        userId: string,
        symbol: string,
        reversalType: string,
        price: number,
        confidence: number,
    ): Promise<Notification> {
        const notification = await this.create({
            userId,
            type: NotificationType.REVERSAL_ALERT,
            title: `${symbol} Reversal Alert`,
            body: `${reversalType.toUpperCase()} reversal detected at $${price.toFixed(2)} (${(confidence * 100).toFixed(0)}% confidence)`,
            data: { symbol, reversalType, price, confidence },
        });

        // TODO: Send push notification via Firebase/APNs
        await this.sendPushNotification(userId, notification);

        return notification;
    }

    /**
     * Get user's notifications
     */
    async getUserNotifications(
        userId: string,
        page = 1,
        limit = 20,
    ): Promise<{ data: Notification[]; total: number }> {
        const [data, total] = await this.notificationRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { data, total };
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string, userId: string): Promise<void> {
        await this.notificationRepository.update(
            { id: notificationId, userId },
            { isRead: true },
        );
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId: string): Promise<void> {
        await this.notificationRepository.update(
            { userId, isRead: false },
            { isRead: true },
        );
    }

    /**
     * Register device token for push notifications
     */
    async registerDevice(
        userId: string,
        dto: RegisterDeviceDto,
    ): Promise<DeviceToken> {
        // Check if token already exists
        let deviceToken = await this.deviceTokenRepository.findOne({
            where: { userId, token: dto.token },
        });

        if (deviceToken) {
            // Update existing
            deviceToken.isActive = true;
            deviceToken.deviceName = dto.deviceName;
        } else {
            // Create new
            deviceToken = this.deviceTokenRepository.create({
                userId,
                token: dto.token,
                platform: dto.platform,
                deviceName: dto.deviceName,
            });
        }

        return this.deviceTokenRepository.save(deviceToken);
    }

    /**
     * Unregister device token
     */
    async unregisterDevice(userId: string, token: string): Promise<void> {
        await this.deviceTokenRepository.update(
            { userId, token },
            { isActive: false },
        );
    }

    /**
     * Send push notification to user's devices
     * TODO: Implement actual push notification via Firebase/APNs
     */
    private async sendPushNotification(
        userId: string,
        notification: Notification,
    ): Promise<void> {
        const devices = await this.deviceTokenRepository.find({
            where: { userId, isActive: true },
        });

        for (const device of devices) {
            this.logger.log(
                `Sending push to ${device.platform}: ${notification.title}`,
            );
            // TODO: Implement Firebase/APNs integration
        }
    }
}
