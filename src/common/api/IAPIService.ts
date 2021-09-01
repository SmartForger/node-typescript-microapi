import { Organization } from '../../models/Organization';
import { Person } from '../../models/Person';
import { APIResponse } from './dto';

export interface IAPIService {
  getPerson(kwuid: number): Promise<APIResponse<Person>>;
  getOrganizationsForPerson(kwuid: number): Promise<APIResponse<Organization[]>>;
  getOrganizationAncestors(orgId: number): Promise<APIResponse<Organization[]>>;
}
