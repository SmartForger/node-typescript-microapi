import { Organization } from '../../../models/Organization';
import { delay } from '../../../utils';
import { APIResponse } from '../../../common/api/dto';
import { IRestAPIService } from '../../../common/api/IRestAPIService';

class MockAPIService implements IRestAPIService {
  public async getOrganizationAncestors(orgId: number): Promise<APIResponse<Organization[]>> {
    const { orgParents } = mockData();

    const ancestorIDs: number[] = [];
    let iterator = orgId;
    while (orgParents[iterator]) {
      ancestorIDs.push(orgParents[iterator]);
      iterator = orgParents[iterator];
    }

    const ancestors = ancestorIDs.map((orgId) => getOrganizationFromID(orgId, orgParents[orgId] || null));

    return {
      data: ancestors,
    };
  }

  public async getOrganization(orgId: number): Promise<APIResponse<Organization>> {
    await delay(getRandomDelay());

    const { orgParents } = mockData();

    return {
      data: getOrganizationFromID(orgId, orgParents[orgId]),
    };
  }

  public async getOrganizationsForPerson(kwuid: number): Promise<APIResponse<Organization[]>> {
    const { orgIdsByKwuid, orgParents } = mockData();

    if (!orgIdsByKwuid[kwuid]) {
      throw new Error('not found');
    }

    const organizations = orgIdsByKwuid[kwuid].map((orgId) => getOrganizationFromID(orgId, orgParents[orgId]));

    return {
      data: organizations,
    };
  }
}

function mockData() {
  const orgIdsByKwuid: Record<number, number[]> = {
    1: [5, 8],
    2: [16, 17],
    3: [15, 9],
    4: [17, 12],
  };

  const orgParents: Record<number, number> = {
    2: 1,
    3: 2,
    4: 2,
    5: 4,
    6: 4,
    7: 3,
    8: 7,
    9: 7,
    10: 1,
    11: 10,
    12: 11,
    13: 11,
    14: 13,
    15: 5,
    16: 6,
    17: 12,
  };

  return {
    orgIdsByKwuid,
    orgParents,
  };
}

function getOrganizationFromID(orgId: number, parentId: number | null): Organization {
  return {
    id: orgId,
    org_type_id: 2,
    name: `Org ${orgId}`,
    member_count: null,
    org_key: `${orgId}`,
    parent_org_id: parentId,
  };
}

function getRandomDelay() {
  return Math.floor(Math.random() * 1000) + 500;
}

export default new MockAPIService();
