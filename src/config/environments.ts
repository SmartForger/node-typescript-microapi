import dotenv from 'dotenv';

dotenv.config();

export class Environments {
  static readonly serverPort = parseInt(process.env.SERVER_PORT, 10) || 8080;
  static readonly redisHost = process.env.REDIS_HOST || '127.0.0.1';
  static readonly redisPort = parseInt(process.env.REDIS_PORT, 10) || 6379;
  static readonly pnoServiceUrl = process.env.PNO_SERVICE_URL || '';
}
