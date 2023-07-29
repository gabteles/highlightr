import HighlightStore from '../data/HighlightStore';
import SaveHighlightCommand from './SaveHighlightCommand';

describe('SaveHighlightCommand', () => {
  beforeEach(async () => {
    await HighlightStore.highlights.clear();
  });

  it('saves a new highlight', async () => {
    const countBefore = await HighlightStore.highlights.count();
    SaveHighlightCommand({ highlight: { uuid: '1234', createdAt: new Date().toISOString(), text: 'Foobar', url: 'http://localhost:3000' } });
    const countAfter = await HighlightStore.highlights.count();
    expect(countAfter).toBe(countBefore + 1);
  });
});
