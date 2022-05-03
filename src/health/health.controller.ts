import { Controller, Get } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { CacheService } from '../common/services/cache/cache.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private cache: CacheService,
    @InjectSentry() private readonly sentry: SentryService,
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    try {
      return this.health.check([async () => this.cache.getStatus()]);
    } catch (error) {
      this.sentry.instance().captureException(error);
      /* istanbul ignore next */
      throw error;
    }
  }
}
