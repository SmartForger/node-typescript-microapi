import { Controller, Get, Param } from '@nestjs/common';
import { AuthInfo } from '../common/types/AuthInfo';
import { Auth } from '../common/decorators/auth.decorator';
import { UsersService } from './users.service';

@Controller('api/v1/people')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get(':kwuid/orgs')
  findOrganizationsForUser(
    @Param('kwuid') kwuid: number,
    @Auth() auth: AuthInfo,
  ) {
    return this.service.getOrganizationsForUser(kwuid, auth);
  }

  @Get(':kwuid/orgs/reload')
  findOrganizationsForUserReloaded(
    @Param('kwuid') kwuid: number,
    @Auth() auth: AuthInfo,
  ) {
    return this.service.getOrganizationsForUser(kwuid, auth, true);
  }
}
