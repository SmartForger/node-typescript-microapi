import { Organization } from '../../models/Organization';
import { APIResponse } from './dto';

export interface IRestAPIService {
  getOrganization(orgId: number, token: string): Promise<APIResponse<Organization>>;
  getOrganizationsForPerson(kwuid: number, token: string): Promise<APIResponse<Organization[]>>;
  getOrganizationAncestors(orgId: number, token: string): Promise<APIResponse<Organization[]>>;
}
