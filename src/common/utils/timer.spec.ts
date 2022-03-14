import { delay } from './timer';

describe('delay', () => {
  it('should resolve after 100 sec', async () => {
    const ts1 = new Date().getTime();
    await delay(100);
    const ts2 = new Date().getTime();

    expect(ts2 - ts1).toBeGreaterThanOrEqual(100);
  });
});
