import { Test, TestingModule } from '@nestjs/testing';
import { mockUserService } from '../../test/utils';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const { userServiceProvider } = mockUserService();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [userServiceProvider],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
