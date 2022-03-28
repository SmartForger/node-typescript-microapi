import {
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { OrgsService } from './orgs.service';

@Controller('api/v1/orgs')
export class OrgsController {
  constructor(private service: OrgsService) {}

  @Post(':orgId/refresh')
  @HttpCode(204)
  updateOrganizationCache(@Param('orgId') orgId: number, @Req() req: Request) {
    const token = req.headers['authorization'] || '';
    return this.service.updateOrganizationCache(orgId, token);
  }
}
