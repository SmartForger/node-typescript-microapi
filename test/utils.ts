import * as Redis from 'ioredis-mock';
import { OrgType } from 'src/common/types/OrgType';

import { ApiService } from '../src/common/services/api/api.service';
import { AppConfigService } from '../src/common/services/app-config/app-config.service';
import { CacheService } from '../src/common/services/cache/cache.service';
import { UsersService } from '../src/users/users.service';
import { OrgsService } from '../src/orgs/orgs.service';

export const mockAppConfigService = () => {
  const configMock = {
    isAllowedOrgType: (orgType: OrgType) => [1, 2, 3, 5, 6].includes(orgType),
    getRedisExpiration: () => '86400',
  };

  return {
    configProvider: {
      provide: AppConfigService,
      useValue: configMock,
    },
    configMock,
  };
};

export const mockApiService = () => {
  const apiMock = {
    getOrganization: jest.fn(),
    getOrganizationAncestors: jest.fn(),
    getOrganizationsForPerson: jest.fn(),
    getOrganizationMemberCount: jest.fn(),
  };

  return {
    apiProvider: {
      provide: ApiService,
      useValue: apiMock,
    },
    apiMock,
  };
};

export const mockCacheService = () => {
  const cacheMock = {
    getOrganizationsForUser: jest.fn(),
    saveOrganizations: jest.fn(),
    saveOrganization: jest.fn(),
  };

  return {
    cacheProvider: {
      provide: CacheService,
      useValue: cacheMock,
    },
    cacheMock,
  };
};

export const mockUserService = () => {
  const userServiceMock = {
    getOrganizationsForUser: jest.fn(),
  };

  return {
    userServiceProvider: {
      provide: UsersService,
      useValue: userServiceMock,
    },
    userServiceMock,
  };
};

export const mockOrgsService = () => {
  const orgsServiceMock = {
    updateOrganizationCache: jest.fn(),
  };

  return {
    orgsServiceProvider: {
      provide: OrgsService,
      useValue: orgsServiceMock,
    },
    orgsServiceMock,
  };
};

export const mockRedisClient = () => {
  const redisMock = new Redis();

  return {
    redisClientProvider: {
      provide: 'RedisClient',
      useFactory: () => redisMock,
    },
    redisMock,
  };
};

export const convertOrgs = (orgs: any[]) => {
  return orgs.map((org) => ({
    ...org,
    id: org.id.toString(),
    org_type_id: org.org_type_id.toString(),
    org_type: {
      ...org.org_type,
      id: org.org_type.id.toString(),
    },
  }));
};
