import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { pickBy } from 'lodash';
import { APIResponse } from 'src/common/types/APIResponse';
import { AuthInfo } from 'src/common/types/AuthInfo';
import { Organization } from 'src/common/types/Organization';

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

@Injectable()
export class ApiService {
  constructor(private httpService: HttpService) {}

  public async getOrganization(
    orgId: number,
    auth: AuthInfo,
  ): Promise<Organization> {
    return new Promise((resolve, reject) => {
      this.httpService
        .get<APIResponse<Organization>>(`/orgs/${orgId}`, this.getOptions(auth))
        .subscribe({
          next: (response) => {
            const data = this.sanitizeOrg(response.data.data);
            resolve(data);
          },
          error: reject,
        });
    });
  }

  public async getOrganizationAncestors(
    orgId: number,
    auth: AuthInfo,
  ): Promise<Organization[]> {
    return new Promise((resolve) => {
      this.httpService
        .get<APIResponse<Organization[]>>(
          `/orgs/${orgId}/ancestors`,
          this.getOptions(auth),
        )
        .subscribe({
          next: (response) => {
            const data = response.data.data.map((org: unknown) =>
              this.sanitizeOrg(org),
            );
            resolve(data);
          },
          error: () => {
            resolve([]);
          },
        });
    });
  }

  public async getOrganizationsForPerson(
    kwuid: number,
    auth: AuthInfo,
  ): Promise<Organization[]> {
    return new Promise((resolve) => {
      this.httpService
        .get<APIResponse<Organization[]>>(
          `/people/${kwuid}/orgs`,
          this.getOptions(auth),
        )
        .subscribe({
          next: (response) => {
            const data = response.data.data.map((org: unknown) =>
              this.sanitizeOrg(org),
            );
            resolve(data);
          },
          error: () => {
            resolve([]);
          },
        });
    });
  }

  public async getOrganizationMemberCount(
    orgId: number,
    auth: AuthInfo,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.httpService
        .get<{ meta: { total: number } }>(`/orgs/${orgId}/people`, {
          ...this.getOptions(auth),
          params: {
            limit: 1,
          },
        })
        .subscribe({
          next: (response) => {
            resolve(response.data.meta.total);
          },
          error: reject,
        });
    });
  }

  private getOptions(auth: AuthInfo) {
    return auth.token
      ? {
          headers: {
            authorization: auth.token,
          },
        }
      : {
          headers: {
            apikey: auth.apikey,
          },
        };
  }

  private sanitizeOrg(data: any) {
    const org = pickBy(
      data,
      (val, key) => orgFields.includes(key) && val !== null,
    );
    return org as Organization;
  }
}
