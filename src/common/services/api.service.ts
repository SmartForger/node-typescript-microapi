import axios, { AxiosInstance } from 'axios';
import { Environments } from '../../config/environments';
import { Organization } from '../../models/Organization';
import { IAPIService } from '../types/services/IAPIService';
import { APIResponse } from '../types/dto';
import { pick } from 'lodash';

const orgFields = [
  'id',
  'name',
  'email',
  'fax',
  'phone',
  'dba_name',
  'start_dt',
  'end_dt',
  'address_1',
  'address_2',
  'city',
  'state',
  'postal_code',
  'parent_org_id',
  'country',
  'member_count',
  'created_at',
  'deleted_at',
  'updated_at',
  'org_key',
  'org_type_id',
  'legacy_org_id',
  'legacy_team_id',
  'legacy_expansion_team_id',
  'org_type',
];

export class APIService implements IAPIService {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: Environments.pnoServiceUrl,
    });
  }

  public async getOrganization(orgId: number, token: string): Promise<APIResponse<Organization>> {
    const { data } = await this.axios.get(`/orgs/${orgId}`, this.getOptions(token));

    return data;
  }

  public async getOrganizationAncestors(orgId: number, token: string): Promise<APIResponse<Organization[]>> {
    try {
      const { data } = await this.axios.get(`/orgs/${orgId}/ancestors`, this.getOptions(token));

      return data;
    } catch (e) {
      return { data: [] };
    }
  }

  public async getOrganizationsForPerson(kwuid: number, token: string): Promise<APIResponse<Organization[]>> {
    const { data } = await this.axios.get(`/people/${kwuid}/orgs`, this.getOptions(token));
    data.data = data.data.map((org: unknown) => pick(org, orgFields));
    return data;
  }

  public async getOrganizationMemberCount(orgId: number, token: string): Promise<number> {
    const { data } = await this.axios.get(`/orgs/${orgId}/people`, {
      ...this.getOptions(token),
      params: {
        limit: 1,
      },
    });

    return data.meta.total;
  }

  private getOptions(token: string) {
    return {
      headers: {
        authorization: token,
      },
    };
  }
}

export default new APIService();
