import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { AssetType } from '../entities/asset.entity';

export class CreateAssetDto {
    @ApiProperty({ example: 'BTC' })
    @IsString()
    symbol: string;

    @ApiProperty({ example: 'Bitcoin' })
    @IsString()
    name: string;

    @ApiProperty({ enum: AssetType, example: AssetType.CRYPTO })
    @IsEnum(AssetType)
    type: AssetType;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false, example: 'Binance' })
    @IsString()
    @IsOptional()
    exchange?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    logoUrl?: string;
}
