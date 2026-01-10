import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import mlApiConfig from './config/ml-api.config';
import googleConfig from './config/google.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AssetsModule } from './modules/assets/assets.module';
import { PredictionsModule } from './modules/predictions/predictions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
    imports: [
        // Global Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig, jwtConfig, redisConfig, mlApiConfig, googleConfig],
            envFilePath: ['.env.local', '.env'],
        }),

        // Database Connection
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.name'),
                autoLoadEntities: true,
                synchronize: configService.get('app.nodeEnv') === 'development',
                logging: configService.get('app.nodeEnv') === 'development',
            }),
            inject: [ConfigService],
        }),

        // Feature Modules
        AuthModule,
        UsersModule,
        AssetsModule,
        PredictionsModule,
        NotificationsModule,
    ],
})
export class AppModule { }
