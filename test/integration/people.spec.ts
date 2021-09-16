import request from 'supertest';

import app from '../../src/app';
import { Organization } from '../../src/models/Organization';
import RestAPIService from '../../src/common/api/RestAPIService';
import { getRedis } from '../../src/common/redis';

jest.mock('ioredis', () => require('ioredis-mock/jest'));
jest.mock('../../src/common/api/RestAPIService');

describe('People controller', () => {
  describe('getOrganizations', () => {
    it('should return all organizations', async () => {
      const res = await request(app).get('/people/1/orgs').expect(200);

      const orgIds = res.body.data.map((org: Organization) => org.id);
      orgIds.sort();
      expect(orgIds.join(',')).toBe('1,2,3,4,5,7,8');
    });

    it('should return cached organizations', async () => {
      const getOrganizationFn = jest.spyOn(RestAPIService, 'getOrganizationsForPerson');
      await request(app).get('/people/1/orgs').expect(200);
      expect(getOrganizationFn).not.toBeCalled();
    });

    it('should return 404 error for invalid members', async () => {
      await request(app).get('/people/5/orgs').expect(404);
    });

    it('should return 401 error for invalid token', async () => {
      await request(app).get('/people/5/orgs').expect(500);
    });
  });

  describe('getFreshOrganizations', () => {
    it('should return non-cahced organizations', async () => {
      await request(app).get('/people/1/orgs').expect(200);
      const orgIds = await getRedis().hget('orgIds', '1');
      expect(orgIds).toBeTruthy();

      const getOrganizationFn = jest.spyOn(RestAPIService, 'getOrganizationsForPerson');
      await request(app).get('/people/1/orgs/reload').expect(200);
      expect(getOrganizationFn).toBeCalled();
    });

    it('should return 404 error for invalid members', async () => {
      await request(app).get('/people/5/orgs').expect(404);
    });

    it('should return 401 error for invalid token', async () => {
      await request(app).get('/people/5/orgs').expect(500);
    });
  });
});
