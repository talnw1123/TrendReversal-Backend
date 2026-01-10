import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Asset, AssetType } from '../entities/asset.entity';

@Exclude()
export class AssetResponseDto {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    symbol: string;

    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty({ enum: AssetType })
    type: AssetType;

    @Expose()
    @ApiProperty({ required: false })
    description?: string;

    @Expose()
    @ApiProperty({ required: false })
    exchange?: string;

    @Expose()
    @ApiProperty({ required: false })
    logoUrl?: string;

    @Expose()
    @ApiProperty({ required: false })
    currentPrice?: number;

    @Expose()
    @ApiProperty({ required: false })
    priceChange24h?: number;

    @Expose()
    @ApiProperty({ required: false })
    priceChangePercent24h?: number;

    @Expose()
    @ApiProperty({ required: false })
    marketCap?: number;

    @Expose()
    @ApiProperty({ required: false })
    volume24h?: number;

    @Expose()
    @ApiProperty({ required: false })
    lastPriceUpdate?: Date;

    constructor(partial: Partial<Asset>) {
        Object.assign(this, partial);
    }
}
