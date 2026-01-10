import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';

import { PredictionsService } from './predictions.service';
import {
    PredictionRequestDto,
    PredictionResponseDto,
    ReversalPointDto,
} from './dto';
import { Auth } from '@common/decorators';

@ApiTags('predictions')
@Controller({ path: 'predictions', version: '1' })
export class PredictionsController {
    constructor(private readonly predictionsService: PredictionsService) { }

    @Post()
    @Auth()
    @ApiOperation({ summary: 'Request prediction with reversal points' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Prediction result with reversal points',
        type: PredictionResponseDto,
    })
    async getPrediction(
        @Body() request: PredictionRequestDto,
    ): Promise<PredictionResponseDto> {
        return this.predictionsService.getPrediction(request);
    }

    @Get('reversal-points/:symbol')
    @Auth()
    @ApiOperation({ summary: 'Get reversal points for a symbol' })
    @ApiParam({ name: 'symbol', example: 'BTCUSDT' })
    @ApiQuery({ name: 'timeframe', required: false, example: '1h' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of reversal points',
        type: [ReversalPointDto],
    })
    async getReversalPoints(
        @Param('symbol') symbol: string,
        @Query('timeframe') timeframe?: string,
        @Query('limit') limit?: number,
    ): Promise<ReversalPointDto[]> {
        return this.predictionsService.getReversalPoints(
            symbol,
            timeframe || '1h',
            limit || 10,
        );
    }

    @Get('batch')
    @Auth()
    @ApiOperation({ summary: 'Get reversal points for multiple symbols' })
    @ApiQuery({ name: 'symbols', description: 'Comma-separated list of symbols' })
    @ApiQuery({ name: 'timeframe', required: false })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Reversal points grouped by symbol',
    })
    async getBatchReversalPoints(
        @Query('symbols') symbols: string,
        @Query('timeframe') timeframe?: string,
    ): Promise<Record<string, ReversalPointDto[]>> {
        const symbolList = symbols.split(',').map((s) => s.trim().toUpperCase());
        return this.predictionsService.getBatchReversalPoints(
            symbolList,
            timeframe,
        );
    }

    @Get('health')
    @ApiOperation({ summary: 'Check ML API health status' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'ML API health status',
    })
    async checkHealth(): Promise<{ mlApiHealthy: boolean }> {
        const isHealthy = await this.predictionsService.checkMlApiHealth();
        return { mlApiHealthy: isHealthy };
    }
}
