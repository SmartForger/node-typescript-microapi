import { Environments } from '../../config/environments';
import { Organization } from '../../models/Organization';
import { getRedis } from '../redis';

export class APIRedis {
  public async getOrgIds(kwuid: number): Promise<number[]> {
    try {
      const result = await getRedis().get(`people:${kwuid}:orgIds`);
      return result.split(',').map((orgId) => +orgId);
    } catch (e) {
      return [];
    }
  }

  public setOrgIds(kwuid: number, orgIds: number[]): Promise<'OK'> {
    return getRedis().set(`people:${kwuid}:orgIds`, orgIds.join(','), 'EX', Environments.redisExpireTime);
  }

  public async getOrganzations(orgIds: number[]): Promise<Organization[]> {
    const redis = getRedis();
    const orgs = await Promise.all(orgIds.map((orgId) => redis.get(`org:${orgId}`)));
    return orgs.map((org) => JSON.parse(org));
  }

  public async setOrganization(org: Organization): Promise<'OK' | 'Exists'> {
    const redis = getRedis();
    const key = `org:${org.id}`;

    if ((await redis.exists(key)) > 0) {
      return 'Exists';
    }

    return redis.set(key, JSON.stringify(org), 'EX', Environments.redisExpireTime);
  }
}
