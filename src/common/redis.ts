import IORedis from 'ioredis';
import { Environments } from '../config/environments';

let redis: IORedis.Redis;

export function getRedis(): IORedis.Redis {
  if (!redis) {
    redis = new IORedis(Environments.redisUrl);
  }

  return redis;
}
