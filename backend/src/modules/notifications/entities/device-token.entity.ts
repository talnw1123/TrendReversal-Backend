import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum DevicePlatform {
    IOS = 'ios',
    ANDROID = 'android',
}

@Entity('device_tokens')
@Index(['userId', 'token'], { unique: true })
export class DeviceToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    token: string;

    @Column({ type: 'enum', enum: DevicePlatform })
    platform: DevicePlatform;

    @Column({ nullable: true })
    deviceName?: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
