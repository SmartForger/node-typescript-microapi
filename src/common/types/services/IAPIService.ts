import { Organization } from '../../../models/Organization';
import { APIResponse } from '../dto';

export interface IAPIService {
  getOrganization(orgId: number, token: string): Promise<APIResponse<Organization>>;
  getOrganizationAncestors(orgId: number, token: string): Promise<APIResponse<Organization[]>>;
  getOrganizationsForPerson(kwuid: number, token: string): Promise<APIResponse<Organization[]>>;
  getOrganizationMemberCount(orgId: number, token: string): Promise<number>;
}
