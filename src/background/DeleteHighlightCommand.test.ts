import IndexedDbStore from '../data/IndexedDbStore';
import DeleteHighlightCommand from './DeleteHighlightCommand';

describe('DeleteHighlightCommand', () => {
  beforeEach(async () => {
    await IndexedDbStore.highlights.clear();
  });

  it('deletes the highligh', async () => {
    IndexedDbStore.highlights.add({
      uuid: '1234',
      createdAt: new Date().toISOString(),
      text: 'Foobar',
      url: 'http://localhost:3000',
      container: '#container',
      anchorNode: '#anchorNode',
      anchorOffset: 0,
      focusNode: '#focusNode',
      focusOffset: 1,
    });
    const countBefore = await IndexedDbStore.highlights.count();
    DeleteHighlightCommand({ highlightId: '1234' });
    const countAfter = await IndexedDbStore.highlights.count();
    expect(countAfter).toBe(countBefore - 1);
  });
});
