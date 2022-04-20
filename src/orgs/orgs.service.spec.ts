import { Test, TestingModule } from '@nestjs/testing';
import {
  mockApiService,
  mockAppConfigService,
  mockCacheService,
} from '../../test/utils';
import { OrgType } from '../common/types/OrgType';
import { OrgsService } from './orgs.service';

describe('OrgsService', () => {
  let service: OrgsService;
  let api: {
    getOrganization: jest.Mock;
  };
  let cache: {
    saveOrganization: jest.Mock;
  };

  beforeEach(async () => {
    const { apiProvider, apiMock } = mockApiService();
    const { cacheProvider, cacheMock } = mockCacheService();
    const { configProvider } = mockAppConfigService();

    cache = cacheMock;
    api = apiMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [apiProvider, cacheProvider, configProvider, OrgsService],
    }).compile();

    service = module.get<OrgsService>(OrgsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateOrganizationCache', () => {
    it('should not allow updating invalid org types', () => {
      api.getOrganization.mockResolvedValueOnce({
        org_type: {
          id: OrgType.Team,
        },
      });

      expect(() =>
        service.updateOrganizationCache(1, { token: 'Token', apikey: '' }),
      ).rejects.toThrowError('Invalid org type');
    });

    it('should update org in cache', async () => {
      const org = {
        id: 1,
        org_type: {
          id: OrgType.MarketCenter,
        },
      };
      api.getOrganization.mockResolvedValueOnce(org);

      await service.updateOrganizationCache(1, { token: 'Token', apikey: '' });

      expect(cache.saveOrganization).toBeCalledWith(org);
    });
  });
});
