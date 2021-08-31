import { Request, Response } from 'express';
import { User } from '../models/dto/User';
import { RestController } from '../common/RestController';

export class PeopleController extends RestController {
  constructor() {
    super();

    // Configure routes here
    this.routes.get('/:id', this.getItem.bind(this));
  }

  public getItem(req: Request, res: Response): void {
    const { id } = req.params;

    const user: User = {
      id,
      name: `Test User ${id}`,
    };

    this.sendData(res, user);
  }
}
