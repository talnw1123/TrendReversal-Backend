import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';

import { Asset, AssetType } from './entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { QueryAssetsDto } from './dto/query-assets.dto';

@Injectable()
export class AssetsService {
    constructor(
        @InjectRepository(Asset)
        private readonly assetsRepository: Repository<Asset>,
    ) { }

    /**
     * Create a new asset
     */
    async create(createAssetDto: CreateAssetDto): Promise<Asset> {
        const asset = this.assetsRepository.create(createAssetDto);
        return this.assetsRepository.save(asset);
    }

    /**
     * Find all assets with optional filtering
     */
    async findAll(query: QueryAssetsDto): Promise<{
        data: Asset[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { type, search, page = 1, limit = 20 } = query;

        const queryBuilder = this.assetsRepository
            .createQueryBuilder('asset')
            .where('asset.isActive = :isActive', { isActive: true });

        if (type) {
            queryBuilder.andWhere('asset.type = :type', { type });
        }

        if (search) {
            queryBuilder.andWhere(
                '(asset.symbol ILIKE :search OR asset.name ILIKE :search)',
                { search: `%${search}%` },
            );
        }

        const [data, total] = await queryBuilder
            .orderBy('asset.symbol', 'ASC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { data, total, page, limit };
    }

    /**
     * Find asset by symbol
     */
    async findBySymbol(symbol: string): Promise<Asset | null> {
        return this.assetsRepository.findOne({
            where: { symbol: symbol.toUpperCase() },
        });
    }

    /**
     * Get asset by symbol (throws if not found)
     */
    async getBySymbol(symbol: string): Promise<Asset> {
        const asset = await this.findBySymbol(symbol);
        if (!asset) {
            throw new NotFoundException(`Asset ${symbol} not found`);
        }
        return asset;
    }

    /**
     * Find multiple assets by symbols
     */
    async findBySymbols(symbols: string[]): Promise<Asset[]> {
        const upperSymbols = symbols.map((s) => s.toUpperCase());
        return this.assetsRepository.find({
            where: { symbol: In(upperSymbols) },
        });
    }

    /**
     * Update asset price
     */
    async updatePrice(
        symbol: string,
        priceData: {
            currentPrice: number;
            priceChange24h?: number;
            priceChangePercent24h?: number;
            volume24h?: number;
        },
    ): Promise<Asset> {
        const asset = await this.getBySymbol(symbol);

        Object.assign(asset, priceData, { lastPriceUpdate: new Date() });
        return this.assetsRepository.save(asset);
    }

    /**
     * Get trending assets (top volume)
     */
    async getTrending(limit = 10): Promise<Asset[]> {
        return this.assetsRepository.find({
            where: { isActive: true },
            order: { volume24h: 'DESC' },
            take: limit,
        });
    }

    /**
     * Get top gainers
     */
    async getTopGainers(limit = 10): Promise<Asset[]> {
        return this.assetsRepository.find({
            where: { isActive: true },
            order: { priceChangePercent24h: 'DESC' },
            take: limit,
        });
    }

    /**
     * Get top losers
     */
    async getTopLosers(limit = 10): Promise<Asset[]> {
        return this.assetsRepository.find({
            where: { isActive: true },
            order: { priceChangePercent24h: 'ASC' },
            take: limit,
        });
    }
}
