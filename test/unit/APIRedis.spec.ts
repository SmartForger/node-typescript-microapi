import { APIRedis } from '../../src/common/api/APIRedis';
import { getRedis } from '../../src/common/redis';
import { Organization } from '../../src/models/Organization';

jest.mock('ioredis', () => require('ioredis-mock/jest'));

fdescribe('APIRedis', () => {
  let apiRedis = new APIRedis();

  beforeEach(async () => {
    const redis = getRedis();
    await redis.flushall();
  });

  it('should skip if organization exists', async () => {
    const organization: Organization = {
      id: 1,
      member_count: 1,
      name: 'Org 1',
      org_key: 'org1',
      org_type_id: 1,
      parent_org_id: null,
    };

    const result1 = await apiRedis.setOrganization(organization);
    expect(result1).toBe('OK');
    const result2 =  await apiRedis.setOrganization(organization);
    expect(result2).toBe('Exists');
  });
});
