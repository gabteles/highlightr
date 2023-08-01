import IndexedDbStore from '../data/IndexedDbStore';
import EnableCommand from './EnableCommand';

describe('EnableCommand', () => {
  beforeEach(async () => {
    await IndexedDbStore.config.clear();
  });

  it('saves the `enabled` config', async () => {
    await EnableCommand({ enabled: true });
    let config = await IndexedDbStore.config.toArray();
    expect(config).toEqual([{ name: 'enabled', value: true, updatedAt: expect.any(Number) }]);

    await EnableCommand({ enabled: false });
    config = await IndexedDbStore.config.toArray();
    expect(config).toEqual([{ name: 'enabled', value: false, updatedAt: expect.any(Number) }]);
  });
});
