import { Organization } from '../../models/Organization';
import { Person } from '../../models/Person';
import { APIResponse } from './dto';
import { IRestAPIService } from './IRestAPIService';

export class RestAPIService implements IRestAPIService {
  getOrganization(orgId: any): Promise<APIResponse<Organization>> {
    throw new Error('Method not implemented.');
  }
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
