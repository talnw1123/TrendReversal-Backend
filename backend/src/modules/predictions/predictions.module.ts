import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';
import { MlApiService } from './services/ml-api.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 30000,
            maxRedirects: 5,
        }),
        ConfigModule,
    ],
    controllers: [PredictionsController],
    providers: [PredictionsService, MlApiService],
    exports: [PredictionsService],
})
export class PredictionsModule { }
