import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { RewriteFrames } from '@sentry/integrations';
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
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const env = configService.get<string>('NODE_ENV');

        if (env === 'test') {
          return {};
        }

        return {
          dsn: configService.get<string>('SENTRY_DSN'),
          debug: true,
          environment: env,
          tracesSampleRate: 1.0,
          attachStacktrace: true,
          release: configService.get<string>('npm_package_version'),
          integrations: [
            new RewriteFrames({
              root: process.cwd(),
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
    CommonModule,
    UsersModule,
    HealthModule,
    OrgsModule,
  ],
})
export class AppModule {}
