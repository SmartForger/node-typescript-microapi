import { Organization } from '../../../models/Organization';

export interface IRedisService {
  getOrganzationsForPerson(kwuid: number): Promise<Organization[]>;
  saveOrganzationsForPerson(kwuid: number, orgs: Organization[]): Promise<void>;
}
