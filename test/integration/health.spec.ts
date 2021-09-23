import request from 'supertest';

import app from '../../src/app';
import * as redisModule from '../../src/common/redis';

jest.mock('ioredis', () => require('ioredis-mock/jest'));

describe('Health controller', () => {
  it('should return ok', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.status).toBe('pass');
    expect(res.body.info.cache).toBe('up');
  });

  it('should return warning', async () => {
    jest.spyOn(redisModule, 'getRedis').mockImplementation(
      () => {
        const redis = redisModule.getRedis();
        redis.ping = () => Promise.reject('error');

        return redis;
      }
    );

    const res = await request(app).get('/health').expect(200);
    expect(res.body.status).toBe('warn');
    expect(res.body.info.cache).toBe('down');
  });
});
