import { waitFor } from '@testing-library/react';
import HighlightStore from '../data/HighlightStore';
import GetConfigSubscription from './GetConfigSubscription';

describe('GetConfigSubscription', () => {
  beforeEach(async () => {
    await HighlightStore.config.clear();
  });

  it('emits the config not exposing api keys', async () => {
    await HighlightStore.config.bulkAdd([
      { name: 'valid', value: true },
      { name: 'openai-key', value: '1234' },
    ]);

    const emit = jest.fn();
    GetConfigSubscription({}, emit);

    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { valid: true, present: true } }));
  });

  it('emits new config as the database gets updated', async () => {
    const emit = jest.fn();

    GetConfigSubscription({}, emit);

    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { present: false, valid: undefined } }));

    await HighlightStore.config.bulkAdd([
      { name: 'valid', value: false },
      { name: 'openai-key', value: '1234' },
    ]);
    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { valid: false, present: true } }));

    await HighlightStore.config.delete('openai-key');
    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { valid: false, present: false} }));

    await HighlightStore.config.update('valid', { value: true });
    await waitFor(() => expect(emit).toHaveBeenCalledWith({ config: { valid: true, present: false} }));
  });
});
