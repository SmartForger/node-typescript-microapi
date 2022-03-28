import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgType } from '../../../common/types/OrgType';
import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  const configGet = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useFactory: () => ({
            get: configGet,
          }),
        },
        AppConfigService,
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  describe('getRedisExpiration', () => {
    it('should return default value', () => {
      const result = service.getRedisExpiration();
      expect(result).toBe('86400');
    });

    it('should return config value', () => {
      configGet.mockReturnValueOnce('3600');
      const result = service.getRedisExpiration();
      expect(result).toBe('3600');
    });
  });

  describe('isAllowedOrgType', () => {
    it('should not allow any org types if variable is not set', () => {
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((orgType) => {
        const result = service.isAllowedOrgType(orgType);
        expect(result).toBe(false);
      });
    });

    it('should allow specified org types', () => {
      configGet.mockReturnValueOnce('1,2,3,5,6');
      const result = service.isAllowedOrgType(OrgType.MarketCenter);
      expect(result).toBe(true);
    });

    it('should not allow unspecified org types', () => {
      configGet.mockReturnValueOnce('1,2,3,5,6');
      const result = service.isAllowedOrgType(OrgType.Team);
      expect(result).toBe(false);
    });
  });
});
