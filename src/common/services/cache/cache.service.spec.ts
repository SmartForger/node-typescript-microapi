import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { convertOrgs, mockRedisClient } from '../../../../test/utils';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let redisClient: any;
  const orgs = [
    {
      id: 1,
      name: 'Org 1',
      org_type_id: 3,
      org_type: {
        id: 3,
        name: 'MC',
      },
    },
    {
      id: 2,
      name: 'Org 2',
      org_type_id: 1,
      org_type: {
        id: 1,
        name: 'KWRI',
      },
    },
  ];

  beforeEach(async () => {
    const { redisClientProvider } = mockRedisClient();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [CacheService, redisClientProvider],
    }).compile();

    service = module.get<CacheService>(CacheService);
    redisClient = module.get<any>('RedisClient');
  });

  afterEach(() => {
    redisClient.flushall();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(redisClient).toBeDefined();
  });

  describe('getOrganizationsForUser', () => {
    it('should return empty array for a user not in cache', async () => {
      const result = await service.getOrganizationsForUser(2);
      expect(result).toEqual([]);
    });

    it('should return list of cached orgs', async () => {
      await redisClient.sadd('orgIds:kwuid:1', [1, 2]);
      await redisClient.hset('org:1', 'id', 1);
      await redisClient.hset('org:1', 'name', 'Org 1');
      await redisClient.hset('org:1', 'org_type.id', 3);
      await redisClient.hset('org:1', 'org_type.name', 'MC');
      await redisClient.hset('org:1', 'org_type_id', 3);
      await redisClient.hset('org:2', 'id', 2);
      await redisClient.hset('org:2', 'name', 'Org 2');
      await redisClient.hset('org:2', 'org_type.id', 1);
      await redisClient.hset('org:2', 'org_type.name', 'KWRI');
      await redisClient.hset('org:2', 'org_type_id', 1);

      const result = await service.getOrganizationsForUser(1);

      expect(result).toEqual(convertOrgs(orgs));
    });
  });

  describe('saveOrganizations', () => {
    it('should save organizations', async () => {
      await service.saveOrganizations(1, orgs as any);
      const orgIds = await redisClient.smembers('orgIds:kwuid:1');
      expect(orgIds).toEqual(['1', '2']);

      const org1 = await redisClient.hgetall('org:1');
      expect(org1).toEqual({
        id: '1',
        name: 'Org 1',
        org_type_id: '3',
        'org_type.id': '3',
        'org_type.name': 'MC',
      });
      const org2 = await redisClient.hgetall('org:2');
      expect(org2).toEqual({
        id: '2',
        name: 'Org 2',
        org_type_id: '1',
        'org_type.id': '1',
        'org_type.name': 'KWRI',
      });
    });
  });
});
