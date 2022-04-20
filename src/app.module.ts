import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { OrgsModule } from './orgs/orgs.module';
import { getTransports } from './common/utils/logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        level:
          configService.get<string>('NODE_ENV') === 'production'
            ? 'info'
            : 'silly',
        transports: getTransports(configService),
      }),
    }),
    CommonModule,
    UsersModule,
    HealthModule,
    OrgsModule,
  ],
})
export class AppModule {}
