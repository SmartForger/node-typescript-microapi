import { Router, Response } from 'express';

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

  protected abstract initRoutes(): void;
}
