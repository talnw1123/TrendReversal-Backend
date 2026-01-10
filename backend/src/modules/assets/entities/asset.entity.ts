import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum AssetType {
    STOCK = 'stock',
    CRYPTO = 'crypto',
    FOREX = 'forex',
    COMMODITY = 'commodity',
}

@Entity('assets')
@Index(['symbol', 'type'], { unique: true })
export class Asset {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    symbol: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: AssetType })
    type: AssetType;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    exchange?: string;

    @Column({ nullable: true })
    logoUrl?: string;

    @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
    currentPrice?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    priceChange24h?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    priceChangePercent24h?: number;

    @Column({ type: 'decimal', precision: 30, scale: 2, nullable: true })
    marketCap?: number;

    @Column({ type: 'decimal', precision: 30, scale: 2, nullable: true })
    volume24h?: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastPriceUpdate?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
