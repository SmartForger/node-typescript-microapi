import { Request, Response } from 'express';
import { unionBy, reduce } from 'lodash';
import { Organization } from '../models/Organization';
import { RestController } from '../common/RestController';
import api from '../common/api';
import { APIResponse } from '../common/api/dto';

export class PeopleController extends RestController {
  constructor() {
    super();

    // Configure routes here
    this.routes.get('/:kwuid', this.getPerson.bind(this));
  }

  public async getPerson(req: Request, res: Response): Promise<void> {
    const kwuid = parseInt(req.params.kwuid, 10) || 0;

    try {
      const { data: person } = await api.getPerson(kwuid);
      const { data: organizations } = await api.getOrganizationsForPerson(kwuid);
      const responses = await Promise.all(organizations.map((org) => api.getOrganizationAncestors(org.id)));
      const orgAncestors = reduce(
        responses,
        (prev: Organization[], cur: APIResponse<Organization[]>) => [...prev, ...cur.data],
        [],
      );

      this.sendData(res, {
        person,
        organizations: unionBy(organizations, orgAncestors, (org: Organization) => org.id),
      });
    } catch (err) {
      console.log(err);
      // TODO: Better error handling
      res.status(500).send('Server error');
    }
  }
}
