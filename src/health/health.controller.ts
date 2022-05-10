import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { CacheService } from '../common/services/cache/cache.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private cache: CacheService,
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    return this.health.check([async () => this.cache.getStatus()]);
  }
}
