import { Organization } from '../../models/Organization';
import { Person } from '../../models/Person';
import { APIResponse } from './dto';

export interface IRestAPIService {
  getPerson(kwuid: number, token: string): Promise<APIResponse<Person>>;
  getOrganization(orgId: number, token: string): Promise<APIResponse<Organization>>;
  getOrganizationsForPerson(kwuid: number, token: string): Promise<APIResponse<Organization[]>>;
  getOrganizationAncestors(orgId: number, token: string): Promise<APIResponse<Organization[]>>;
}
