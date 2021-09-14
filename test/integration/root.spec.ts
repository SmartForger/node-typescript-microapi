import request from 'supertest';

import app from '../../src/app';

describe('API Root', () => {
  it('returns api running', async () => {
    const res = await request(app).get('/').expect(200);
    expect(res.text).toBe('API is running ...');
  });
});
