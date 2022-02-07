import request from 'supertest';

import app from '../../../src/app';
import { Organization } from '../../../src/models/Organization';
import apiService from '../../../src/common/services/api.service';
import orgsService from '../../../src/common/services/organizations.service';
import { IOrganizationsService } from '../../../src/common/types/services/IOrganizationsService';
import { getRedis } from '../../../src/common/redis';

jest.mock('ioredis', () => require('ioredis-mock/jest'));
jest.mock('../../../src/common/services/api.service');

describe('People controller', () => {
  let orgApi: Partial<IOrganizationsService> = {
    getOrganizationsForPerson: orgsService.getOrganizationsForPerson,
  };

  describe('getOrganizations', () => {
    it('should return all organizations', async () => {
      const res = await request(app).get('/api/v1/people/1/orgs').expect(200);

      const orgIds = res.body.data.map((org: Organization) => org.id);
      orgIds.sort();
      expect(orgIds).toEqual([1, 2, 3, 4, 5, 7, 8]);
    });

    it('should return cached organizations', async () => {
      const getOrganizationFn = jest.spyOn(apiService, 'getOrganizationsForPerson');
      await request(app).get('/api/v1/people/1/orgs').expect(200);
      expect(getOrganizationFn).not.toBeCalled();
    });

    it('should return 401 error for server errors', async () => {
      orgsService.getOrganizationsForPerson = jest.fn().mockImplementationOnce(() => {
        throw {
          response: {
            status: 401,
          },
        };
      });
      await request(app).get('/api/v1/people/1/orgs').expect(401);
      orgsService.getOrganizationsForPerson = orgApi.getOrganizationsForPerson;
    });

    it('should return 404 error for invalid members', async () => {
      await request(app).get('/api/v1/people/5/orgs').expect(404);
    });

    it('should return 500 error for server errors', async () => {
      orgsService.getOrganizationsForPerson = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });
      await request(app).get('/api/v1/people/1/orgs').expect(500);
      orgsService.getOrganizationsForPerson = orgApi.getOrganizationsForPerson;
    });

    it('should use default kwuid', async () => {
      orgsService.getOrganizationsForPerson = jest.fn();

      await request(app).get('/api/v1/people/aaa/orgs').expect(200);
      expect(orgsService.getOrganizationsForPerson).toBeCalledWith(0, '');

      orgsService.getOrganizationsForPerson = orgApi.getOrganizationsForPerson;
    });
  });

  describe('getFreshOrganizations', () => {
    it('should return non-cahced organizations', async () => {
      await request(app).get('/api/v1/people/1/orgs').expect(200);
      const orgIds = await getRedis().smembers('orgIds:kwuid:1');
      expect(orgIds.length).toBeGreaterThan(0);

      const getOrganizationFn = jest.spyOn(apiService, 'getOrganizationsForPerson');
      await request(app).get('/api/v1/people/1/orgs/reload').expect(200);
      expect(getOrganizationFn).toBeCalled();
    });

    it('should return 404 error for invalid members', async () => {
      await request(app).get('/api/v1/people/5/orgs/reload').expect(404);
    });

    it('should return 500 error for server errors', async () => {
      orgsService.getOrganizationsForPerson = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });
      await request(app).get('/api/v1/people/1/orgs/reload').expect(500);
      orgsService.getOrganizationsForPerson = orgApi.getOrganizationsForPerson;
    });

    it('should use default kwuid', async () => {
      orgsService.getOrganizationsForPerson = jest.fn();

      await request(app).get('/api/v1/people/aaa/orgs/reload').expect(200);
      expect(orgsService.getOrganizationsForPerson).toBeCalledWith(0, '', true);

      orgsService.getOrganizationsForPerson = orgApi.getOrganizationsForPerson;
    });
  });
});
