import { Injectable } from '@nestjs/common';
import { chain } from 'lodash';
import { ApiService } from '../common/services/api/api.service';
import { AppConfigService } from '../common/services/app-config/app-config.service';
import { CacheService } from '../common/services/cache/cache.service';
import { Organization } from '../common/types/Organization';

@Injectable()
export class UsersService {
  constructor(
    private cacheService: CacheService,
    private apiService: ApiService,
    private config: AppConfigService,
  ) {}

  public async getOrganizationsForUser(
    kwuid: number,
    token: string,
    force?: boolean,
  ): Promise<Organization[]> {
    if (!force) {
      const cachedOrganizations =
        await this.cacheService.getOrganizationsForUser(kwuid);
      if (cachedOrganizations.length > 0) {
        return cachedOrganizations;
      }
    }

    const organizations = await this.apiService.getOrganizationsForPerson(
      kwuid,
      token,
    );
    const responses = await Promise.all(
      organizations.map((org) =>
        this.apiService.getOrganizationAncestors(org.id, token),
      ),
    );
    const allOrganizations = chain(responses)
      .reduce(
        (prev: Organization[], cur: Organization[]) => [...prev, ...cur],
        [],
      )
      .unionBy(organizations, 'id')
      .filter((org) => this.config.isAllowedOrgType(org.org_type_id))
      .value();
    await this.cacheService.saveOrganizations(kwuid, allOrganizations);

    return allOrganizations;
  }
}
