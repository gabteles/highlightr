import IndexedDbStore from '../data/IndexedDbStore';
import SaveHighlightCommand from './SaveHighlightCommand';

describe('SaveHighlightCommand', () => {
  beforeEach(async () => {
    await IndexedDbStore.highlights.clear();
  });

  it('saves a new highlight', async () => {
    const countBefore = await IndexedDbStore.highlights.count();
    SaveHighlightCommand({
      highlight: {
        uuid: '1234',
        createdAt: new Date().toISOString(),
        text: 'Foobar',
        url: 'http://localhost:3000',
        container: '#container',
        anchorNode: '#anchorNode',
        anchorOffset: 0,
        focusNode: '#focusNode',
        focusOffset: 1,
      }
    });
    const countAfter = await IndexedDbStore.highlights.count();
    expect(countAfter).toBe(countBefore + 1);
  });
});
