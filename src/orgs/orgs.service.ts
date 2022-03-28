import { Injectable } from '@nestjs/common';
import { ApiService } from '../common/services/api/api.service';
import { AppConfigService } from '../common/services/app-config/app-config.service';
import { CacheService } from '../common/services/cache/cache.service';

@Injectable()
export class OrgsService {
  constructor(
    private apiService: ApiService,
    private cacheService: CacheService,
    private configService: AppConfigService,
  ) {}

  public async updateOrganizationCache(
    orgId: number,
    token: string,
  ): Promise<void> {
    const org = await this.apiService.getOrganization(orgId, token);

    if (!this.configService.isAllowedOrgType(org.org_type.id)) {
      throw new Error('Invalid org type');
    }

    await this.cacheService.saveOrganization(org);
  }
}
