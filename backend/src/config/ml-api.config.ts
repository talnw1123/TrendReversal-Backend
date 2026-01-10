import { registerAs } from '@nestjs/config';

export default registerAs('mlApi', () => ({
    baseUrl: process.env.ML_API_BASE_URL || 'http://localhost:5000',
    apiKey: process.env.ML_API_KEY || '',
    timeout: parseInt(process.env.ML_API_TIMEOUT ?? '30000', 10),
}));
