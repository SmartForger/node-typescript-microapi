import { Organization } from '../../models/Organization';
import { Person } from '../../models/Person';
import { APIResponse } from './dto';
import { IAPIService } from './IAPIService';

export class APIService implements IAPIService {
  getOrganizationAncestors(orgId: number): Promise<APIResponse<Organization[]>> {
    throw new Error('Method not implemented.');
  }
  getPerson(kwuid: number): Promise<APIResponse<Person>> {
    throw new Error('Method not implemented.');
  }
  getOrganizationsForPerson(kwuid: number): Promise<APIResponse<Organization[]>> {
    throw new Error('Method not implemented.');
  }
}
