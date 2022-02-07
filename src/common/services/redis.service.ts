import { flattenObjectToPairs, createObject } from '../../utils';
import { Environments } from '../../config/environments';
import { Organization } from '../../models/Organization';
import { getRedis } from '../redis';
import { IRedisService } from '../types/services/IRedisService';

export class RedisService implements IRedisService {
  public async getOrganzationsForPerson(kwuid: number): Promise<Organization[]> {
    const redis = getRedis();
    const orgIds = await redis.smembers(`orgIds:kwuid:${kwuid}`);

    if (orgIds.length === 0) {
      return [];
    }

    const data = await redis.pipeline(orgIds.map((orgId) => ['hgetall', `org:${orgId}`])).exec();
    return data.map(([, orgData]) => createObject(orgData) as Organization);
  }

  public async saveOrganzationsForPerson(kwuid: number, orgs: Organization[]): Promise<void> {
    const orgIds = orgs.map((org) => org.id.toString());
    const redisCommands: string[][] = [...this.setOrgIdsCommand(kwuid, orgIds)];

    orgs.forEach((org) => {
      redisCommands.push(...this.saveObjectCommands(org, `org:${org.id}`));
    });
    const pipeline = getRedis().pipeline(redisCommands);
    await pipeline.exec();
  }

  private setOrgIdsCommand(kwuid: number, orgIds: string[]): string[][] {
    return [['sadd', `orgIds:kwuid:${kwuid}`, ...orgIds]];
  }

  private saveObjectCommands(obj: unknown, mainKey: string): string[][] {
    return flattenObjectToPairs(obj).map((pair: any[]) => [ // eslint-disable-line
      'hset',
      mainKey,
      ...pair,
      'EX',
      Environments.redisExpireTime,
    ]);
  }
}

export default new RedisService();
