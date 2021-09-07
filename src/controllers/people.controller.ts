import { Request, Response } from 'express';
import { RestController } from '../common/RestController';
import { api } from '../common/api';

export class PeopleController extends RestController {
  constructor() {
    super();

    // Configure routes here
    this.routes.get('/:kwuid', this.getPerson.bind(this));
  }

  public async getPerson(req: Request, res: Response): Promise<void> {
    const kwuid = parseInt(req.params.kwuid, 10) || 0;
    const token = req.headers?.authorization || '';

    try {
      const person = await api.getPerson(kwuid, token);
      const organizations = await api.getOrganizationsForPerson(kwuid, token);

      this.sendData(res, {
        person,
        organizations,
      });
    } catch (err) {
      console.log(err);
      // TODO: Better error handling
      res.status(500).send('Server error');
    }
  }
}
