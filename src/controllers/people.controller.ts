import { Request, Response } from 'express';
import { RestController } from '../common/RestController';
import { api } from '../common/api';

export class PeopleController extends RestController {
  constructor() {
    super();

    // Configure routes here
    this.routes.get('/:kwuid/orgs', this.getOrganizations.bind(this));
    this.routes.get('/:kwuid/orgs/reload', this.getFreshOrganizations.bind(this));
  }

  public async getOrganizations(req: Request, res: Response): Promise<void> {
    const kwuid = parseInt(req.params.kwuid, 10) || 0;
    const token = req.headers?.authorization || '';

    try {
      const organizations = await api.getOrganizationsForPerson(kwuid, token);

      this.sendData(res, {
        data: organizations,
      });
    } catch (err) {
      console.log(err);
      // TODO: Better error handling
      res.status(500).send('Server error');
    }
  }

  public async getFreshOrganizations(req: Request, res: Response): Promise<void> {
    const kwuid = parseInt(req.params.kwuid, 10) || 0;
    const token = req.headers?.authorization || '';

    try {
      const organizations = await api.getOrganizationsForPerson(kwuid, token, true);

      this.sendData(res, {
        data: organizations,
      });
    } catch (err) {
      console.log(err);
      // TODO: Better error handling
      res.status(500).send('Server error');
    }
  }
}
