import { Controller, Get, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { AssetsService } from './assets.service';
import { QueryAssetsDto } from './dto/query-assets.dto';
import { AssetResponseDto } from './dto/asset-response.dto';
import { AssetType } from './entities/asset.entity';

@ApiTags('assets')
@Controller({ path: 'assets', version: '1' })
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all assets with optional filtering' })
    @ApiQuery({ name: 'type', enum: AssetType, required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of assets',
    })
    async findAll(@Query() query: QueryAssetsDto) {
        return this.assetsService.findAll(query);
    }

    @Get('trending')
    @ApiOperation({ summary: 'Get trending assets by volume' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Trending assets',
    })
    async getTrending(@Query('limit') limit?: number) {
        return this.assetsService.getTrending(limit);
    }

    @Get('gainers')
    @ApiOperation({ summary: 'Get top gaining assets' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Top gainers',
    })
    async getTopGainers(@Query('limit') limit?: number) {
        return this.assetsService.getTopGainers(limit);
    }

    @Get('losers')
    @ApiOperation({ summary: 'Get top losing assets' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Top losers',
    })
    async getTopLosers(@Query('limit') limit?: number) {
        return this.assetsService.getTopLosers(limit);
    }

    @Get(':symbol')
    @ApiOperation({ summary: 'Get asset by symbol' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Asset details',
        type: AssetResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Asset not found',
    })
    async findOne(@Param('symbol') symbol: string): Promise<AssetResponseDto> {
        const asset = await this.assetsService.getBySymbol(symbol);
        return new AssetResponseDto(asset);
    }
}
