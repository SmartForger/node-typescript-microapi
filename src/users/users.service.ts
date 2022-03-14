import { Injectable } from '@nestjs/common';
import { chain } from 'lodash';
import { OrgType } from '../common/types/OrgType';
import { ApiService } from '../common/services/api/api.service';
import { CacheService } from '../common/services/cache/cache.service';
import { Organization } from '../common/types/Organization';

const ALLOWED_ORG_TYPES = [
  OrgType.KWRI,
  OrgType.MarketCenter,
  OrgType.Region,
  OrgType.WorldwideRegion,
  OrgType.WorldwideMarketCenter,
];

@Injectable()
export class UsersService {
  constructor(
    private cacheService: CacheService,
    private apiService: ApiService,
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
      .filter((org) => ALLOWED_ORG_TYPES.includes(org.org_type_id))
      .value();
    await this.cacheService.saveOrganizations(kwuid, allOrganizations);

    return allOrganizations;
  }
}
