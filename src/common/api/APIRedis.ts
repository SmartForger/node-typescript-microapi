import { Organization } from '../../models/Organization';
import { Person } from '../../models/Person';
import { getRedis } from '../redis';

export class APIRedis {
  public async getPerson(kwuid: number): Promise<Person | null> {
    try {
      const result = await getRedis().get(`people:${kwuid}`);
      return JSON.parse(result);
    } catch (e) {
      return null;
    }
  }

  public setPerson(person: Person): Promise<'OK'> {
    return getRedis().set(`people:${person.id}`, JSON.stringify(person));
  }

  public async getOrgIds(kwuid: number): Promise<number[]> {
    try {
      const result = await getRedis().get(`people:${kwuid}:orgIds`);
      return result.split(',').map((orgId) => +orgId);
    } catch (e) {
      return [];
    }
  }

  public setOrgIds(kwuid: number, orgIds: number[]): Promise<'OK'> {
    return getRedis().set(`people:${kwuid}:orgIds`, orgIds.join(','));
  }

  public async getOrganzations(orgIds: number[]): Promise<Organization[]> {
    try {
      const redis = getRedis();
      const orgs = await Promise.all(orgIds.map((orgId) => redis.get(`org:${orgId}`)));
      return orgs.map((org) => JSON.parse(org));
    } catch (e) {
      return [];
    }
  }

  public async setOrganization(org: Organization): Promise<'OK'> {
    const redis = getRedis();
    if ((await redis.exists(`${org.id}`)) > 0) {
      return 'OK';
    }

    return redis.set(`org:${org.id}`, JSON.stringify(org));
  }
}
