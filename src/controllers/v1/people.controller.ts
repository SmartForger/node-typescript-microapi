import { Request, Response } from 'express';
import { RestController } from '../../common/RestController';
import { orgsService } from '../../common/services';

export class PeopleController extends RestController {
  public async getOrganizations(req: Request, res: Response): Promise<void> {
    const kwuid = parseInt(req.params.kwuid, 10) || 0;
    const token = req.headers.authorization || '';

    try {
      const organizations = await orgsService.getOrganizationsForPerson(kwuid, token);

      this.sendData(res, {
        data: organizations,
      });
    } catch (err) {
      this.handleError(err, res);
    }
  }

  public async getFreshOrganizations(req: Request, res: Response): Promise<void> {
    const kwuid = parseInt(req.params.kwuid, 10) || 0;
    const token = req.headers.authorization || '';

    try {
      const organizations = await orgsService.getOrganizationsForPerson(kwuid, token, true);

      this.sendData(res, {
        data: organizations,
      });
    } catch (err) {
      this.handleError(err, res);
    }
  }

  protected initRoutes(): void {
    this.routes.get('/:kwuid/orgs', this.getOrganizations.bind(this));
    this.routes.get('/:kwuid/orgs/reload', this.getFreshOrganizations.bind(this));
  }
}
