import { delay } from '../../src/utils';

describe('delay', () => {
  it('should delay 1 second', async () => {
    const ts = new Date().getTime();
    await delay(1000);
    const ts1 = new Date().getTime();
    expect(ts1 - ts).toBeGreaterThan(1000);
  });
});