import { Request, Response } from 'express';
import { getRedis } from '../common/redis';
import { RestController } from '../common/RestController';

export class HealthController extends RestController {
  public async checkHealth(req: Request, res: Response): Promise<void> {
    const result = {
      status: 'pass',
      info: {
        cache: 'up',
      },
    };

    try {
      await getRedis().ping();
    } catch {
      result.status = 'warn';
      result.info.cache = 'down';
    }

    this.sendData(res, result);
  }

  protected initRoutes(): void {
    this.routes.get('/', this.checkHealth.bind(this));
  }
}