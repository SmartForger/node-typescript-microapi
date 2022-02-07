import { Organization } from '../../../models/Organization';

export interface IOrganizationsService {
  getOrganizationsForPerson(kwuid: number, token: string, force?: boolean): Promise<Organization[]>;
}
