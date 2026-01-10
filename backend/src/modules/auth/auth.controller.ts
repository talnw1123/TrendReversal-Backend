import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
    Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService, GoogleUserPayload } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User successfully registered',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email already registered',
    })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User successfully logged in',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(loginDto);
    }

    /**
     * Initiate Google OAuth flow
     * Redirects to Google login page
     */
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Login with Google - redirects to Google OAuth' })
    @ApiResponse({
        status: HttpStatus.FOUND,
        description: 'Redirects to Google OAuth page',
    })
    async googleAuth() {
        // Guard handles redirect to Google
    }

    /**
     * Google OAuth callback
     * Called by Google after user authenticates
     */
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @ApiExcludeEndpoint()
    async googleAuthCallback(
        @Req() req: { user: GoogleUserPayload },
        @Res() res: Response,
    ) {
        const authResult = await this.authService.googleLogin(req.user);

        // For mobile app: redirect with tokens as query params
        // In production, use a custom URL scheme like: myapp://auth?token=xxx
        const redirectUrl = `${process.env.MOBILE_APP_REDIRECT_URL || 'http://localhost:3000/auth/success'}?accessToken=${authResult.accessToken}&refreshToken=${authResult.refreshToken}`;

        return res.redirect(redirectUrl);
    }

    /**
     * Google login for mobile apps
     * Mobile app sends Google ID token directly
     */
    @Post('google/mobile')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with Google ID token (for mobile apps)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User successfully logged in with Google',
        type: AuthResponseDto,
    })
    async googleMobileLogin(
        @Body() body: { idToken: string },
    ): Promise<AuthResponseDto> {
        // TODO: Verify Google ID token using Google Auth Library
        // const ticket = await client.verifyIdToken({
        //   idToken: body.idToken,
        //   audience: process.env.GOOGLE_CLIENT_ID,
        // });
        // const payload = ticket.getPayload();

        // For now, this is a placeholder that should be implemented
        // with proper Google ID token verification
        throw new Error(
            'Google mobile login requires Google Auth Library integration. ' +
            'Use /auth/google for web OAuth flow.',
        );
    }
}
