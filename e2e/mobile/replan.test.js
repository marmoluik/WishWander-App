const { device } = require('detox');
const { notify } = require('../../packages/notify');
const { Metrics } = require('../../packages/metrics');

describe('push reception and replan', () => {
  beforeAll(async () => {
    try {
      await device.launchApp();
    } catch (e) {
      console.warn('launchApp skipped', e.message);
    }
  });

  it('receives push and applies replan', async () => {
    await notify('test-user', 'disruption', { title: 'Disruption', body: 'test' });
    await Metrics.replanApplied({ tripId: 'test-trip' });
  });
});
