import { Router, Response } from 'express';

export class RestController {
  protected routes: Router;

  constructor() {
    this.routes = Router();
  }

  public getRoutes(): Router {
    return this.routes;
  }

  protected sendData<T>(res: Response<T>, data: T): void {
    res.status(200).send(data);
  }
}
