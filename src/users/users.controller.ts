import { Controller, Get, Param, Req, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/v1/people')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get(':kwuid/orgs')
  findOrganizationsForUser(@Param('kwuid') kwuid: number, @Req() req: Request) {
    const token = req.headers['authorization'] || '';
    return this.service.getOrganizationsForUser(kwuid, token);
  }

  @Get(':kwuid/orgs/reload')
  findOrganizationsForUserReloaded(
    @Param('kwuid') kwuid: number,
    @Req() req: Request,
  ) {
    const token = req.headers['authorization'] || '';
    return this.service.getOrganizationsForUser(kwuid, token, true);
  }
}
