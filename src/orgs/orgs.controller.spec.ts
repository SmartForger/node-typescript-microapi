import { Test, TestingModule } from '@nestjs/testing';
import { mockOrgsService } from '../../test/utils';
import { OrgsController } from './orgs.controller';

describe('OrgsController', () => {
  let controller: OrgsController;

  beforeEach(async () => {
    const { orgsServiceProvider } = mockOrgsService();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgsController],
      providers: [orgsServiceProvider],
    }).compile();

    controller = module.get<OrgsController>(OrgsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
