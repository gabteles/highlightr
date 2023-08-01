import { waitFor } from '@testing-library/react';
import IndexedDbStore from '../data/IndexedDbStore';
import GetConfigSubscription from './GetConfigSubscription';

describe('GetConfigSubscription', () => {
  beforeEach(async () => {
    await IndexedDbStore.config.clear();
  });

  it('emits the config not exposing api keys', async () => {
    await IndexedDbStore.config.bulkAdd([
      { name: 'valid', value: true, updatedAt: Date.now() },
      { name: 'openai-key', value: '1234', updatedAt: Date.now() },
      { name: 'enabled', value: true, updatedAt: Date.now() },
    ]);

    const emit = jest.fn();
    GetConfigSubscription({}, emit);

    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { enabled: true, valid: true, present: true } }));
  });

  it('emits new config as the database gets updated', async () => {
    const emit = jest.fn();

    GetConfigSubscription({}, emit);

    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { enabled: true, present: false, valid: undefined } }));

    await IndexedDbStore.config.bulkAdd([
      { name: 'valid', value: false, updatedAt: Date.now() },
      { name: 'openai-key', value: '1234', updatedAt: Date.now() },
    ]);
    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { enabled: true, valid: false, present: true } }));

    await IndexedDbStore.config.delete('openai-key');
    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { enabled: true, valid: false, present: false} }));

    await IndexedDbStore.config.update('valid', { value: true });
    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { enabled: true, valid: true, present: false} }));
  });
});
