import { unionBy, reduce } from 'lodash';

import { Organization } from '../../models/Organization';
import { APIRedis } from './APIRedis';
import { APIResponse } from './dto';
import restAPI from './RestAPIService';

export class APIService {
  private redis: APIRedis;

  constructor() {
    this.redis = new APIRedis();
  }

  public async getOrganizationsForPerson(kwuid: number, token: string, force?: boolean): Promise<Organization[]> {
    const cachedOrgIds = await this.redis.getOrgIds(kwuid);
    if (!force && cachedOrgIds.length > 0) {
      const cachedOrganizations = await this.redis.getOrganzations(cachedOrgIds);
      return cachedOrganizations;
    }

    const { data: organizations } = await restAPI.getOrganizationsForPerson(kwuid, token);
    const responses = await Promise.all(organizations.map((org) => restAPI.getOrganizationAncestors(org.id, token)));
    const orgAncestors = reduce(
      responses,
      (prev: Organization[], cur: APIResponse<Organization[]>) => [...prev, ...cur.data],
      [],
    );

    const allOrganizations = unionBy(organizations, orgAncestors, (org: Organization) => org.id);
    await Promise.all(
      allOrganizations.map((org) =>
        (async () => {
          const count = await restAPI.getOrganizationMemberCount(org.id, token);
          org.member_count = count;
          await this.redis.setOrganization(org);
        })(),
      ),
    );

    await this.redis.setOrgIds(
      kwuid,
      allOrganizations.map((org) => org.id),
    );

    return allOrganizations;
  }
}
