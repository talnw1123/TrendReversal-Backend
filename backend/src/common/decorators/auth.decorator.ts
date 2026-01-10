import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

/**
 * Custom decorator that combines JWT auth guard with Swagger documentation
 * Usage: @Auth()
 */
export const Auth = () => {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        ApiBearerAuth('JWT-auth'),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
};
