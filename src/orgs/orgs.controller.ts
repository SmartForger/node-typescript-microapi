import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import { AuthInfo } from '../common/types/AuthInfo';
import { Auth } from '../common/decorators/auth.decorator';
import { OrgsService } from './orgs.service';

@Controller('api/v1/orgs')
export class OrgsController {
  constructor(private service: OrgsService) {}

  @Post(':orgId/refresh')
  @HttpCode(204)
  updateOrganizationCache(
    @Param('orgId') orgId: number,
    @Auth() auth: AuthInfo,
  ) {
    return this.service.updateOrganizationCache(orgId, auth);
  }
}
