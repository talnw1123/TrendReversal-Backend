import { Injectable, Logger } from '@nestjs/common';

import { MlApiService } from './services/ml-api.service';
import {
    PredictionRequestDto,
    PredictionResponseDto,
    ReversalPointDto,
} from './dto';

@Injectable()
export class PredictionsService {
    private readonly logger = new Logger(PredictionsService.name);

    constructor(private readonly mlApiService: MlApiService) { }

    /**
     * Get prediction with reversal points for a symbol
     */
    async getPrediction(
        request: PredictionRequestDto,
    ): Promise<PredictionResponseDto> {
        this.logger.log(
            `Getting prediction for ${request.symbol} - ${request.timeframe}`,
        );

        // Call ML API
        const prediction = await this.mlApiService.getPrediction(request);

        // TODO: Cache the result in Redis for better performance
        // TODO: Store prediction history in database for analytics

        return prediction;
    }

    /**
     * Get latest reversal points for a symbol
     */
    async getReversalPoints(
        symbol: string,
        timeframe: string = '1h',
        limit: number = 10,
    ): Promise<ReversalPointDto[]> {
        this.logger.log(`Getting reversal points for ${symbol}`);

        return this.mlApiService.getReversalPoints(symbol, timeframe, limit);
    }

    /**
     * Get reversal points for multiple symbols
     */
    async getBatchReversalPoints(
        symbols: string[],
        timeframe: string = '1h',
    ): Promise<Record<string, ReversalPointDto[]>> {
        const results: Record<string, ReversalPointDto[]> = {};

        // Fetch in parallel
        await Promise.all(
            symbols.map(async (symbol) => {
                try {
                    results[symbol] = await this.getReversalPoints(symbol, timeframe);
                } catch (error) {
                    this.logger.warn(`Failed to get reversal points for ${symbol}`);
                    results[symbol] = [];
                }
            }),
        );

        return results;
    }

    /**
     * Check ML API health
     */
    async checkMlApiHealth(): Promise<boolean> {
        return this.mlApiService.healthCheck();
    }
}
