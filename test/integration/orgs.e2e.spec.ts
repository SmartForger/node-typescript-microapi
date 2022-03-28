import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import {
  mockApiService,
  mockRedisClient,
  mockAppConfigService,
} from '../utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let api: {
    getOrganization: jest.Mock;
  };
  let redis: any;

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

  describe('/api/v1/orgs/:orgId/refresh (POST)', () => {
    it('update existing org', async () => {
      await redis.hset('org:1', 'id', 1);
      await redis.hset('org:1', 'name', 'Org 1');
      await redis.hset('org:1', 'org_type.id', 3);
      await redis.hset('org:1', 'org_type.name', 'MC');
      await redis.hset('org:1', 'org_type_id', 3);

      const org = {
        id: 1,
        name: 'Org 111',
        org_type_id: 3,
        org_type: {
          id: 3,
          name: 'MC',
        },
      };

      api.getOrganization.mockResolvedValueOnce(org);

      const response = await request(app.getHttpServer()).post(
        '/api/v1/orgs/1/refresh',
      );
      expect(response.status).toBe(204);

      const name = await redis.hget('org:1', 'name');
      expect(name).toBe(org.name);
    });
  });
});
