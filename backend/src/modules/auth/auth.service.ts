import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, TokenPayload } from './dto/auth-response.dto';

export interface GoogleUserPayload {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Register a new user
     */
    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const { email, password, name } = registerDto;

        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await this.usersService.create({
            email,
            password: hashedPassword,
            name,
        });

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            ...tokens,
        };
    }

    /**
     * Login user
     */
    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        // Find user
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            ...tokens,
        };
    }

    /**
     * Handle Google OAuth login/signup
     */
    async googleLogin(googleUser: GoogleUserPayload): Promise<AuthResponseDto> {
        const { googleId, email, name, avatar } = googleUser;

        // Check if user exists with this email
        let user = await this.usersService.findByEmail(email);

        if (user) {
            // If user exists but doesn't have googleId, link it
            if (!user.googleId) {
                user = await this.usersService.update(user.id, {
                    googleId,
                    avatar: avatar || user.avatar,
                });
            }
        } else {
            // Create new user with Google account
            user = await this.usersService.createGoogleUser({
                email,
                name,
                googleId,
                avatar,
            });
        }

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            ...tokens,
        };
    }

    /**
     * Refresh access token
     */
    async refreshToken(userId: string): Promise<{ accessToken: string }> {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const payload: TokenPayload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }

    /**
     * Generate access and refresh tokens
     */
    private async generateTokens(
        userId: string,
        email: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const payload: TokenPayload = { sub: userId, email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, { expiresIn: '30d' }),
        ]);

        return { accessToken, refreshToken };
    }
}
