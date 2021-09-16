import request from 'supertest';

import app from '../../src/app';
import { Organization } from '../../src/models/Organization';
import RestAPIService from '../../src/common/api/RestAPIService';
import { APIService } from '../../src/common/api/APIService';
import { api } from '../../src/common/api';
import { getRedis } from '../../src/common/redis';

jest.mock('ioredis', () => require('ioredis-mock/jest'));
jest.mock('../../src/common/api/RestAPIService');

describe('People controller', () => {
  let orgApi: Partial<APIService> = {
    getOrganizationsForPerson: api.getOrganizationsForPerson,
  };

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

    it('should return 500 error for server errors', async () => {
      api.getOrganizationsForPerson = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });
      await request(app).get('/people/1/orgs').expect(500);
      api.getOrganizationsForPerson = orgApi.getOrganizationsForPerson;
    });

    it('should use default kwuid', async () => {
      api.getOrganizationsForPerson = jest.fn();

      await request(app).get('/people/aaa/orgs').expect(200);
      expect(api.getOrganizationsForPerson).toBeCalledWith(0, '');

      api.getOrganizationsForPerson = orgApi.getOrganizationsForPerson;
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
      await request(app).get('/people/5/orgs/reload').expect(404);
    });

    it('should return 500 error for server errors', async () => {
      api.getOrganizationsForPerson = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });
      await request(app).get('/people/1/orgs/reload').expect(500);
      api.getOrganizationsForPerson = orgApi.getOrganizationsForPerson;
    });

    it('should use default kwuid', async () => {
      api.getOrganizationsForPerson = jest.fn();

      await request(app).get('/people/aaa/orgs/reload').expect(200);
      expect(api.getOrganizationsForPerson).toBeCalledWith(0, '', true);

      api.getOrganizationsForPerson = orgApi.getOrganizationsForPerson;
    });
  });
});
