import { unionBy, reduce } from 'lodash';

import { Organization } from '../../models/Organization';
import { APIResponse } from '../types/dto/APIResponse';
import { IOrganizationsService } from '../types/services/IOrganizationsService';
import restAPI from './api.service';
import redis from './redis.service';

export class OrganizationsService implements IOrganizationsService {
  public async getOrganizationsForPerson(kwuid: number, token: string, force?: boolean): Promise<Organization[]> {
    if (!force) {
      const cachedOrganizations = await redis.getOrganzationsForPerson(kwuid);
      if (cachedOrganizations.length > 0) {
        return cachedOrganizations;
      }
    }

    const { data: organizations } = await restAPI.getOrganizationsForPerson(kwuid, token);
    const responses = await Promise.all(organizations.map((org) => restAPI.getOrganizationAncestors(org.id, token)));
    const orgAncestors = reduce(
      responses,
      (prev: Organization[], cur: APIResponse<Organization[]>) => [...prev, ...cur.data],
      [],
    );
    const allOrganizations = unionBy(organizations, orgAncestors, (org: Organization) => org.id);
    await redis.saveOrganzationsForPerson(kwuid, allOrganizations);

    return allOrganizations;
  }
}

export default new OrganizationsService();
