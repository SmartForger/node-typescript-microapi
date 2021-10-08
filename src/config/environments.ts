import dotenv from 'dotenv';

dotenv.config();

export class Environments {
  static readonly serverPort = parseInt(process.env.SERVER_PORT, 10) || 8080;
  static readonly redisUrl = process.env.REDIS_URL || '127.0.0.1:6379';
  static readonly pnoServiceUrl = process.env.PNO_SERVICE_URL || '';
  static readonly redisExpireTime = parseInt(process.env.REDIS_EXPIRE_TIME) || 86400;
  static readonly logLevel = process.env.LOG_LEVEL;
  static readonly nodeEnv = process.env.NODE_ENV || 'local';
}
