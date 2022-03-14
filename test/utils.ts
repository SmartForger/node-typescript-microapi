import * as Redis from 'ioredis-mock';

import { ApiService } from '../src/common/services/api/api.service';
import { CacheService } from '../src/common/services/cache/cache.service';
import { UsersService } from '../src/users/users.service';

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
