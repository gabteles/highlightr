import IndexedDbStore from '../data/IndexedDbStore';
import SaveOpenAIKeyCommand from './SaveOpenAIKeyCommand';
import OpenAIAPI from '../data/OpenAIAPI';

describe('SaveOpenAIKeyCommand', () => {
  beforeEach(async () => {
    await IndexedDbStore.config.clear();
  });

  it('saves the new key and validates it', async () => {
    jest.spyOn(OpenAIAPI, 'isValidKey').mockResolvedValue(true);

    await SaveOpenAIKeyCommand({ key: '1234' });

    const config = await IndexedDbStore.config.toArray();
    expect(config).toEqual([
      { name: 'openai-key', value: '1234', updatedAt: expect.any(Number) },
      { name: 'valid', value: true, updatedAt: expect.any(Number) },
    ]);
  });
});
