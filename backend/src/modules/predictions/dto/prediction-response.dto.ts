import { ApiProperty } from '@nestjs/swagger';

export enum ReversalType {
    BULLISH = 'bullish', // Price expected to go up
    BEARISH = 'bearish', // Price expected to go down
}

export class ReversalPointDto {
    @ApiProperty({
        description: 'Timestamp of the reversal point',
        example: '2024-01-15T10:00:00Z',
    })
    timestamp: Date;

    @ApiProperty({
        description: 'Price at the reversal point',
        example: 42500.5,
    })
    price: number;

    @ApiProperty({
        enum: ReversalType,
        description: 'Type of reversal (bullish or bearish)',
        example: ReversalType.BULLISH,
    })
    type: ReversalType;

    @ApiProperty({
        description: 'Confidence score from ML model (0-1)',
        example: 0.85,
    })
    confidence: number;

    @ApiProperty({
        required: false,
        description: 'Additional indicators that support this prediction',
        example: ['RSI oversold', 'MACD crossover'],
    })
    indicators?: string[];

    @ApiProperty({
        required: false,
        description: 'Predicted target price',
        example: 44000,
    })
    targetPrice?: number;

    @ApiProperty({
        required: false,
        description: 'Suggested stop loss price',
        example: 41500,
    })
    stopLoss?: number;
}

export class PredictionResponseDto {
    @ApiProperty({
        description: 'Symbol that was predicted',
        example: 'BTCUSDT',
    })
    symbol: string;

    @ApiProperty({
        description: 'Timeframe used for prediction',
        example: '1h',
    })
    timeframe: string;

    @ApiProperty({
        description: 'When the prediction was made',
        example: '2024-01-15T12:00:00Z',
    })
    predictedAt: Date;

    @ApiProperty({
        description: 'Current asset price',
        example: 42500.5,
    })
    currentPrice: number;

    @ApiProperty({
        type: [ReversalPointDto],
        description: 'List of predicted reversal points',
    })
    reversalPoints: ReversalPointDto[];

    @ApiProperty({
        description: 'Overall market trend',
        enum: ['bullish', 'bearish', 'neutral'],
        example: 'bullish',
    })
    overallTrend: string;

    @ApiProperty({
        required: false,
        description: 'Additional analysis notes from ML model',
    })
    analysisNotes?: string;
}
