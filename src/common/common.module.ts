import IORedis from 'ioredis';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './services/app-config/app-config.service';
import { ApiService } from './services/api/api.service';
import { CacheService } from './services/cache/cache.service';

/* istanbul ignore next */
const createRedisInstance = (configService: ConfigService) => {
  return new IORedis(configService.get('REDIS_URL'));
};

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('PNO_SERVICE_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AppConfigService,
    ApiService,
    CacheService,
    {
      provide: 'RedisClient',
      useFactory: createRedisInstance,
      inject: [ConfigService],
    },
  ],
  exports: [AppConfigService, ApiService, CacheService],
})
export class CommonModule {}
