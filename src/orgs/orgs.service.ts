import { Injectable } from '@nestjs/common';
import { AuthInfo } from '../common/types/AuthInfo';
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
    auth: AuthInfo,
  ): Promise<void> {
    const org = await this.apiService.getOrganization(orgId, auth);

    if (!this.configService.isAllowedOrgType(org.org_type.id)) {
      throw new Error('Invalid org type');
    }

    await this.cacheService.saveOrganization(org);
  }
}
