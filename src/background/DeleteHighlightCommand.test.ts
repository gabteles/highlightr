import HighlightStore from '../data/HighlightStore';
import DeleteHighlightCommand from './DeleteHighlightCommand';

describe('DeleteHighlightCommand', () => {
  beforeEach(async () => {
    await HighlightStore.highlights.clear();
  });

  it('deletes the highligh', async () => {
    HighlightStore.highlights.add({
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
    const countBefore = await HighlightStore.highlights.count();
    DeleteHighlightCommand({ highlightId: '1234' });
    const countAfter = await HighlightStore.highlights.count();
    expect(countAfter).toBe(countBefore - 1);
  });
});
