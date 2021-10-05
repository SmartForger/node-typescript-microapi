import { Router, Response } from 'express';
import logger from '../utils/logger';

export abstract class RestController {
  protected routes: Router;

  constructor() {
    this.routes = Router();
    this.initRoutes();
  }

  public getRoutes(): Router {
    return this.routes;
  }

  protected sendData<T>(res: Response<T>, data: T): void {
    res.status(200).send(data);
  }

  // eslint-disable-next-line
  protected handleError(err: any, res: Response): void {
    logger.error(err);

    if (err.response?.status === 401) {
      res.status(401).send('Unauthorized');
    } else if (err.response?.status === 404) {
      res.status(404).send('Not Found');
    } else {
      res.status(500).send('Server error');
    }
  }

  protected abstract initRoutes(): void;
}
