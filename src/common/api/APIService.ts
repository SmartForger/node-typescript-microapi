import { unionBy, reduce } from 'lodash';

import { Organization } from '../../models/Organization';
import { Person } from '../../models/Person';
import { APIRedis } from './APIRedis';
import { APIResponse } from './dto';
import { IRestAPIService } from './IRestAPIService';
// import { MockAPIService } from './MockAPIService';
import { RestAPIService } from './RestAPIService';

export class APIService {
  private restApi: IRestAPIService;
  private redis: APIRedis;

  constructor() {
    // this.restApi = new MockAPIService();
    this.restApi = new RestAPIService();
    this.redis = new APIRedis();
  }

  public async getPerson(kwuid: number, token: string): Promise<Person> {
    const cachedPerson = await this.redis.getPerson(kwuid);
    if (cachedPerson) {
      return cachedPerson;
    }

    const { data } = await this.restApi.getPerson(kwuid, token);
    await this.redis.setPerson(data);

    return data;
  }

  public async getOrganizationsForPerson(kwuid: number, token: string, force?: boolean): Promise<Organization[]> {
    const cachedOrgIds = await this.redis.getOrgIds(kwuid);
    if (!force && cachedOrgIds.length > 0) {
      const cachedOrganizations = await this.redis.getOrganzations(cachedOrgIds);
      return cachedOrganizations;
    }

    const { data: organizations } = await this.restApi.getOrganizationsForPerson(kwuid, token);
    const responses = await Promise.all(
      organizations.map((org) => this.restApi.getOrganizationAncestors(org.id, token)),
    );
    const orgAncestors = reduce(
      responses,
      (prev: Organization[], cur: APIResponse<Organization[]>) => [...prev, ...cur.data],
      [],
    );

    const allOrganizations = unionBy(organizations, orgAncestors, (org: Organization) => org.id);
    await Promise.all(allOrganizations.map((org) => this.redis.setOrganization(org)));

    await this.redis.setOrgIds(
      kwuid,
      allOrganizations.map((org) => org.id),
    );

    return allOrganizations;
  }

  public async getOrganization(orgId: number, token: string): Promise<Organization> {
    const [cachedOrg] = await this.redis.getOrganzations([orgId]);
    if (cachedOrg) {
      return cachedOrg;
    }

    const { data } = await this.restApi.getOrganization(orgId, token);
    await this.redis.setOrganization(data);

    return data;
  }
}
