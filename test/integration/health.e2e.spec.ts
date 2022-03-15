import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { mockRedisClient } from '../utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const { redisClientProvider } = mockRedisClient();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(redisClientProvider.provide)
      .useFactory({ factory: redisClientProvider.useFactory })
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('/health (GET)', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer()).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        details: {
          cache: {
            status: 'up',
          },
        },
        error: {},
        info: {
          cache: {
            status: 'up',
          },
        },
        status: 'ok',
      });
    });
  });
});
