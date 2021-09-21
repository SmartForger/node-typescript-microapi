import axios from 'axios';
import { Environments } from '../../config/environments';
import { Organization } from '../../models/Organization';
import { APIResponse } from './dto';
import { IRestAPIService } from './IRestAPIService';

class RestAPIService implements IRestAPIService {
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

  public async getOrganizationsForPerson(kwuid: number, token: string): Promise<APIResponse<Organization[]>> {
    const { data } = await axios.get(`${Environments.pnoServiceUrl}/people/${kwuid}/orgs`, {
      headers: {
        authorization: token,
      },
    });

    return data;
  }

  public async getOrganizationMemberCount(orgId: number, token: string): Promise<number> {
    const { data } = await axios.get(`${Environments.pnoServiceUrl}/orgs/${orgId}/people`, {
      headers: {
        authorization: token,
      },
      params: {
        limit: 1,
      },
    });

    return data.meta.total;
  }
}

export default new RestAPIService();
