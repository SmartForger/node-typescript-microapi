import { Test, TestingModule } from '@nestjs/testing';
import { mockApiService, mockCacheService } from '../../test/utils';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let cache: {
    getOrganizationsForUser: jest.Mock;
    saveOrganizations: jest.Mock;
  };
  let api: {
    getOrganizationsForPerson: jest.Mock;
    getOrganizationAncestors: jest.Mock;
  };
  const orgs = [
    {
      id: 1,
      name: 'Org 1',
      org_type_id: 3,
      org_type: {
        id: 3,
        name: 'MC',
      },
    },
    {
      id: 2,
      name: 'Org 2',
      org_type_id: 1,
      org_type: {
        id: 1,
        name: 'KWRI',
      },
    },
  ];
  const ancestors = [
    {
      id: 3,
      name: 'Org 3',
      org_type_id: 3,
      org_type: {
        id: 3,
        name: 'MC',
      },
    },
  ];

  beforeEach(async () => {
    const { apiProvider, apiMock } = mockApiService();
    const { cacheProvider, cacheMock } = mockCacheService();

    cache = cacheMock;
    api = apiMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [apiProvider, cacheProvider, UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrganizationsForUser', () => {
    it('should return cached organizations', async () => {
      cache.getOrganizationsForUser.mockResolvedValueOnce(orgs);

      const result = await service.getOrganizationsForUser(1, 'Token');

      expect(cache.getOrganizationsForUser).toBeCalledWith(1);
      expect(result).toEqual(orgs);
    });

    it('should fetch orgs from PNO if organizations are not cached', async () => {
      api.getOrganizationsForPerson.mockResolvedValueOnce([]);
      cache.getOrganizationsForUser.mockResolvedValueOnce([]);
      await service.getOrganizationsForUser(1, 'Token');
      expect(api.getOrganizationsForPerson).toBeCalledWith(1, 'Token');
    });

    it('should save orgs in cache if organizations are not cached', async () => {
      api.getOrganizationsForPerson.mockResolvedValueOnce(orgs.slice(0, 1));
      api.getOrganizationAncestors.mockResolvedValueOnce(ancestors);
      cache.getOrganizationsForUser.mockResolvedValueOnce([]);
      const result = await service.getOrganizationsForUser(1, 'Token');

      expect(result).toEqual([...ancestors, orgs[0]]);
      expect(cache.saveOrganizations).toBeCalledWith(1, result);
    });
  });
});
