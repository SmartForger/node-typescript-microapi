import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrgType } from 'src/common/types/OrgType';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  isAllowedOrgType(orgType: OrgType): boolean {
    const envString = this.configService.get<string>('ALLOWED_ORG_TYPES') || '';
    const allowedTypes = envString
      .split(',')
      .map((orgType: unknown) => +orgType as OrgType);

    return allowedTypes.includes(orgType);
  }

  getRedisExpiration() {
    return this.configService.get<string>('REDIS_EXPIRE_TIME') || '86400';
  }
}
