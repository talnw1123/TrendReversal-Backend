import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum Timeframe {
    M1 = '1m',
    M5 = '5m',
    M15 = '15m',
    M30 = '30m',
    H1 = '1h',
    H4 = '4h',
    D1 = '1d',
    W1 = '1w',
}

export class PredictionRequestDto {
    @ApiProperty({
        example: 'BTCUSDT',
        description: 'Asset symbol to predict',
    })
    @IsString()
    symbol: string;

    @ApiProperty({
        enum: Timeframe,
        example: Timeframe.H1,
        description: 'Timeframe for prediction',
    })
    @IsEnum(Timeframe)
    timeframe: Timeframe;

    @ApiProperty({
        required: false,
        example: 100,
        description: 'Number of candlesticks to analyze',
    })
    @IsNumber()
    @IsOptional()
    lookback?: number;

    @ApiProperty({
        required: false,
        example: 0.7,
        description: 'Confidence threshold (0-1)',
    })
    @IsNumber()
    @IsOptional()
    confidenceThreshold?: number;
}
