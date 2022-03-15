import { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { Organization } from '../../../common/types/Organization';
import {
  createObject,
  flattenObjectToPairs,
} from '../../../common/utils/object';

@Injectable()
export class CacheService {
  constructor(
    private configService: ConfigService,
    @Inject('RedisClient') private client: Redis,
  ) {}

  public async getStatus(): Promise<HealthIndicatorResult> {
    try {
      await this.client.ping();
      return { cache: { status: 'up' } };
    } catch {
      return { cache: { status: 'down' } };
    }
  }

  public async getOrganizationsForUser(kwuid: number): Promise<Organization[]> {
    const orgIds = await this.client.smembers(`orgIds:kwuid:${kwuid}`);

    if (orgIds.length === 0) {
      return [];
    }

    const data = await this.client
      .pipeline(orgIds.map((orgId) => ['hgetall', `org:${orgId}`]))
      .exec();
    return data.map(([, orgData]) => createObject(orgData) as Organization);
  }

  public async saveOrganizations(kwuid: number, orgs: Organization[]) {
    const redisExpireTime =
      this.configService.get('REDIS_EXPIRE_TIME') || 86400;

    const orgIds = orgs.map((org) => org.id.toString());
    const orgIdsKey = `orgIds:kwuid:${kwuid}`;
    const redisCommands: string[][] = [
      ['del', orgIdsKey],
      ['sadd', orgIdsKey, ...orgIds],
      ['expire', orgIdsKey, redisExpireTime],
    ];

    orgs.forEach((org) => {
      const key = `org:${org.id}`;
      redisCommands.push(...this.saveObjectCommands(org, key));
      redisCommands.push(['expire', key, redisExpireTime]);
    });

    const pipeline = this.client.pipeline(redisCommands);
    await pipeline.exec();
  }

  private saveObjectCommands(obj: unknown, mainKey: string): string[][] {
    return flattenObjectToPairs(obj).map((pair: any[]) => [
      'hset',
      mainKey,
      ...pair,
    ]);
  }
}
