import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

export enum NotificationType {
    REVERSAL_ALERT = 'reversal_alert',
    PRICE_ALERT = 'price_alert',
    SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column({ type: 'jsonb', nullable: true })
    data?: {
        symbol?: string;
        reversalType?: string;
        price?: number;
        confidence?: number;
    };

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
