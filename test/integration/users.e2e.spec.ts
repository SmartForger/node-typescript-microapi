import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import {
  convertOrgs,
  mockApiService,
  mockRedisClient,
  mockAppConfigService,
} from '../utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let api: {
    getOrganizationsForPerson: jest.Mock;
    getOrganizationAncestors: jest.Mock;
  };
  let redis: any;
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
  const ancestors = [
    {
      id: 3,
      name: 'Org 3',
      org_type_id: 3,
      org_type: {
        id: 3,
        name: 'MC',
      },
    },
  ];

  beforeEach(async () => {
    const { apiProvider, apiMock } = mockApiService();
    const { redisClientProvider } = mockRedisClient();
    const { configProvider } = mockAppConfigService();

    api = apiMock;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(apiProvider.provide)
      .useValue(apiProvider.useValue)
      .overrideProvider(redisClientProvider.provide)
      .useFactory({ factory: redisClientProvider.useFactory })
      .overrideProvider(configProvider.provide)
      .useValue(configProvider.useValue)
      .compile();

    app = moduleFixture.createNestApplication();
    redis = moduleFixture.get('RedisClient');

    redis.flushall();

    await app.init();
  });

  describe('/api/v1/people/:kwuid/orgs (GET)', () => {
    it('should return orgs from cache', async () => {
      await redis.sadd('orgIds:kwuid:1', [1, 2]);
      await redis.hset('org:1', 'id', 1);
      await redis.hset('org:1', 'name', 'Org 1');
      await redis.hset('org:1', 'org_type.id', 3);
      await redis.hset('org:1', 'org_type.name', 'MC');
      await redis.hset('org:1', 'org_type_id', 3);
      await redis.hset('org:2', 'id', 2);
      await redis.hset('org:2', 'name', 'Org 2');
      await redis.hset('org:2', 'org_type.id', 1);
      await redis.hset('org:2', 'org_type.name', 'KWRI');
      await redis.hset('org:2', 'org_type_id', 1);

      const response = await request(app.getHttpServer()).get(
        '/api/v1/people/1/orgs',
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(convertOrgs(orgs));
    });

    it('should return orgs from PNO', async () => {
      api.getOrganizationsForPerson.mockResolvedValueOnce(orgs.slice(0, 1));
      api.getOrganizationAncestors.mockResolvedValueOnce(ancestors);

      const response = await request(app.getHttpServer()).get(
        '/api/v1/people/1/orgs',
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([...ancestors, orgs[0]]);
    });
  });

  describe('/api/v1/people/:kwuid/orgs/reload (GET)', () => {
    it('should return orgs from PNO', async () => {
      await redis.sadd('orgIds:kwuid:1', [1, 2]);
      await redis.hset('org:1', 'id', 1);
      await redis.hset('org:1', 'name', 'Org 1');
      await redis.hset('org:1', 'org_type.id', 3);
      await redis.hset('org:1', 'org_type.name', 'MC');
      await redis.hset('org:1', 'org_type_id', 3);
      await redis.hset('org:2', 'id', 2);
      await redis.hset('org:2', 'name', 'Org 2');
      await redis.hset('org:2', 'org_type.id', 1);
      await redis.hset('org:2', 'org_type.name', 'KWRI');
      await redis.hset('org:2', 'org_type_id', 1);

      api.getOrganizationsForPerson.mockResolvedValueOnce(orgs.slice(0, 1));
      api.getOrganizationAncestors.mockResolvedValueOnce(ancestors);

      const response = await request(app.getHttpServer()).get(
        '/api/v1/people/1/orgs/reload',
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([...ancestors, orgs[0]]);
    });
  });
});
