import { Organization } from '../../models/Organization';
import { Person } from '../../models/Person';
import { APIResponse } from './dto';

export interface IRestAPIService {
  getPerson(kwuid: number): Promise<APIResponse<Person>>;
  getOrganization(orgId: number): Promise<APIResponse<Organization>>;
  getOrganizationsForPerson(kwuid: number): Promise<APIResponse<Organization[]>>;
  getOrganizationAncestors(orgId: number): Promise<APIResponse<Organization[]>>;
}
