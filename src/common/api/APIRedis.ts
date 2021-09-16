import { Environments } from '../../config/environments';
import { Organization } from '../../models/Organization';
import { getRedis } from '../redis';

export class APIRedis {
  public async getOrgIds(kwuid: number): Promise<number[]> {
    try {
      const result = await getRedis().hget('orgIds', `${kwuid}`);
      return result.split(',').map((orgId) => +orgId);
    } catch (e) {
      return [];
    }
  }

  public setOrgIds(kwuid: number, orgIds: number[]): Promise<number> {
    return getRedis().hset(`orgIds`, `${kwuid}`, orgIds.join(','), 'EX', Environments.redisExpireTime);
  }

  public async getOrganzations(orgIds: number[]): Promise<Organization[]> {
    const redis = getRedis();
    const orgs = await Promise.all(orgIds.map((orgId) => redis.hget('organizations', `${orgId}`)));
    return orgs.map((org) => JSON.parse(org));
  }

  public async setOrganization(org: Organization): Promise<number> {
    const redis = getRedis();
    return redis.hset('organizations', `${org.id}`, JSON.stringify(org), 'EX', Environments.redisExpireTime);
  }
}
