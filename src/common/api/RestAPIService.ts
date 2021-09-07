import axios from 'axios';
import { Environments } from '../../config/environments';
import { Organization } from '../../models/Organization';
import { Person } from '../../models/Person';
import { APIResponse } from './dto';
import { IRestAPIService } from './IRestAPIService';

export class RestAPIService implements IRestAPIService {
  public async getOrganization(orgId: number, token: string): Promise<APIResponse<Organization>> {
    const { data } = await axios.get(`${Environments.pnoServiceUrl}/orgs/${orgId}`, {
      headers: {
        authorization: token,
      },
    });

    return data;
  }
  public async getOrganizationAncestors(orgId: number, token: string): Promise<APIResponse<Organization[]>> {
    try {
      const { data } = await axios.get(`${Environments.pnoServiceUrl}/orgs/${orgId}/ancestors`, {
        headers: {
          authorization: token,
        },
      });

      return data;
    } catch (e) {
      return { data: [] };
    }
  }
  public async getPerson(kwuid: number, token: string): Promise<APIResponse<Person>> {
    const { data } = await axios.get(`${Environments.pnoServiceUrl}/people/${kwuid}`, {
      headers: {
        authorization: token,
      },
    });
    return data;
  }
  public async getOrganizationsForPerson(kwuid: number, token: string): Promise<APIResponse<Organization[]>> {
    const { data } = await axios.get(`${Environments.pnoServiceUrl}/people/${kwuid}/orgs`, {
      headers: {
        authorization: token,
      },
    });

    return data;
  }
}
