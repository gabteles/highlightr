import { waitFor } from '@testing-library/react';
import HighlightStore from '../data/HighlightStore';
import PageHighlightsSubscription from './PageHighlightsSubscription';

describe('PageHighlightsSubscription', () => {
  beforeEach(async () => {
    await HighlightStore.highlights.clear();
  });

  it('emits the highlights for a page', async () => {
    const highlight = { uuid: '1234', createdAt: new Date().toISOString(), text: 'Foobar', url: 'http://localhost:3000' };
    await HighlightStore.highlights.add(highlight);

    const emit = jest.fn();
    PageHighlightsSubscription({ pageUrl: 'http://localhost:3000' }, emit);

    await waitFor(() => expect(emit).toHaveBeenCalledWith({ highlights: [highlight] }));
  });

  it('emits the highlights for a page when a new highlight is added', async () => {
    const highlight = { uuid: '1234', createdAt: new Date().toISOString(), text: 'Foobar', url: 'http://localhost:3000' };

    const emit = jest.fn();
    PageHighlightsSubscription({ pageUrl: 'http://localhost:3000' }, emit);
    await HighlightStore.highlights.add(highlight);

    await waitFor(() => expect(emit.mock.calls[0][0]).toEqual({ highlights: [] }));
    await waitFor(() => expect(emit.mock.calls[1][0]).toEqual({ highlights: [highlight] }));
  });

  it('emits the highlights for a page when a highlight is updated', async () => {
    const highlight = { uuid: '1234', createdAt: new Date().toISOString(), text: 'Foobar', url: 'http://localhost:3000' };
    await HighlightStore.highlights.add(highlight);

    const emit = jest.fn();
    PageHighlightsSubscription({ pageUrl: 'http://localhost:3000' }, emit);
    await waitFor(() => expect(emit.mock.calls[1][0]).toEqual({ highlights: [highlight] }));

    await HighlightStore.highlights.update(highlight.uuid, { text: 'Foobaz' });
    await waitFor(() => expect(emit.mock.calls[2][0]).toEqual({ highlights: [{ ...highlight, text: 'Foobaz' }] }));
  });

  it('emits the highlights for a page when a highlight is deleted', async () => {
    const highlight = { uuid: '1234', createdAt: new Date().toISOString(), text: 'Foobar', url: 'http://localhost:3000' };
    await HighlightStore.highlights.add(highlight);

    const emit = jest.fn();
    PageHighlightsSubscription({ pageUrl: 'http://localhost:3000' }, emit);
    await waitFor(() => expect(emit.mock.calls[1][0]).toEqual({ highlights: [highlight] }));

    await HighlightStore.highlights.delete(highlight.uuid);
    await waitFor(() => expect(emit.mock.calls[2][0]).toEqual({ highlights: [] }));
  });

  it('does not emit the highlights for a page when a highlight is added for another page', async () => {
    const highlight1 = { uuid: '1234', createdAt: new Date().toISOString(), text: 'Foobar', url: 'http://localhost:3000' };
    const highlight2 = { uuid: '4321', createdAt: new Date().toISOString(), text: 'Foobar', url: 'http://external:3000' };
    await HighlightStore.highlights.bulkAdd([highlight1, highlight2]);

    const emit = jest.fn();
    PageHighlightsSubscription({ pageUrl: 'http://localhost:3000' }, emit);

    await waitFor(() => expect(emit).toHaveBeenCalledWith({ highlights: [highlight1] }));
  });
});
