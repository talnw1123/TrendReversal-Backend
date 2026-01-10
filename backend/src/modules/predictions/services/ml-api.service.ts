import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

import {
    ReversalPointDto,
    PredictionRequestDto,
    PredictionResponseDto,
} from '../dto';

/**
 * Service to communicate with friend's ML API
 * This service handles all HTTP requests to the ML prediction API
 */
@Injectable()
export class MlApiService {
    private readonly logger = new Logger(MlApiService.name);
    private readonly baseUrl: string;
    private readonly apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('mlApi.baseUrl') ?? 'http://localhost:5000';
        this.apiKey = this.configService.get<string>('mlApi.apiKey') ?? '';
    }

    /**
     * Get reversal points prediction from ML API
     */
    async getPrediction(
        request: PredictionRequestDto,
    ): Promise<PredictionResponseDto> {
        const url = `${this.baseUrl}/predict`;

        this.logger.log(
            `Requesting prediction for ${request.symbol} (${request.timeframe})`,
        );

        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .post<PredictionResponseDto>(url, request, {
                        headers: this.getHeaders(),
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.handleError(error);
                            throw error;
                        }),
                    ),
            );

            return data;
        } catch (error) {
            this.logger.error(`ML API request failed: ${error.message}`);
            throw new HttpException(
                'Failed to get prediction from ML service',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    /**
     * Get latest reversal points for a symbol
     */
    async getReversalPoints(
        symbol: string,
        timeframe: string = '1h',
        limit: number = 10,
    ): Promise<ReversalPointDto[]> {
        const url = `${this.baseUrl}/reversal-points`;

        this.logger.log(`Fetching reversal points for ${symbol}`);

        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .get<{ reversalPoints: ReversalPointDto[] }>(url, {
                        headers: this.getHeaders(),
                        params: { symbol, timeframe, limit },
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.handleError(error);
                            throw error;
                        }),
                    ),
            );

            return data.reversalPoints;
        } catch (error) {
            this.logger.error(`ML API request failed: ${error.message}`);
            throw new HttpException(
                'Failed to fetch reversal points from ML service',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    /**
     * Check ML API health
     */
    async healthCheck(): Promise<boolean> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/health`),
            );
            return data.status === 'ok';
        } catch {
            return false;
        }
    }

    /**
     * Get headers for ML API requests
     */
    private getHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
        };
    }

    /**
     * Handle HTTP errors
     */
    private handleError(error: AxiosError): void {
        const status = error.response?.status || HttpStatus.SERVICE_UNAVAILABLE;
        const data = error.response?.data as Record<string, unknown> | undefined;
        const message = data?.message || error.message;

        this.logger.error(`ML API Error: ${status} - ${message}`);
    }
}
