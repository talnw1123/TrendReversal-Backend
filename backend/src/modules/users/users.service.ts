import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface CreateGoogleUserDto {
    email: string;
    name: string;
    googleId: string;
    avatar?: string;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    /**
     * Create a new user
     */
    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }

    /**
     * Create a user from Google OAuth
     */
    async createGoogleUser(dto: CreateGoogleUserDto): Promise<User> {
        const user = this.usersRepository.create({
            email: dto.email,
            name: dto.name,
            googleId: dto.googleId,
            avatar: dto.avatar,
            // No password for Google users
        });
        return this.usersRepository.save(user);
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    /**
     * Find user by Google ID
     */
    async findByGoogleId(googleId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { googleId } });
    }

    /**
     * Find user by ID
     */
    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    /**
     * Get user by ID (throws if not found)
     */
    async getById(id: string): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    /**
     * Update user profile
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.getById(id);

        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    /**
     * Update user preferences
     */
    async updatePreferences(
        id: string,
        preferences: Partial<User['preferences']>,
    ): Promise<User> {
        const user = await this.getById(id);

        user.preferences = {
            notifications: preferences?.notifications ?? user.preferences?.notifications ?? true,
            favoriteAssets: preferences?.favoriteAssets ?? user.preferences?.favoriteAssets ?? [],
        };

        return this.usersRepository.save(user);
    }

    /**
     * Add asset to favorites
     */
    async addFavoriteAsset(userId: string, assetSymbol: string): Promise<User> {
        const user = await this.getById(userId);

        if (!user.preferences) {
            user.preferences = { notifications: true, favoriteAssets: [] };
        }

        if (!user.preferences.favoriteAssets.includes(assetSymbol)) {
            user.preferences.favoriteAssets.push(assetSymbol);
        }

        return this.usersRepository.save(user);
    }

    /**
     * Remove asset from favorites
     */
    async removeFavoriteAsset(
        userId: string,
        assetSymbol: string,
    ): Promise<User> {
        const user = await this.getById(userId);

        if (user.preferences?.favoriteAssets) {
            user.preferences.favoriteAssets = user.preferences.favoriteAssets.filter(
                (s) => s !== assetSymbol,
            );
        }

        return this.usersRepository.save(user);
    }
}
