import { waitFor } from '@testing-library/react';
import IndexedDbStore from '../data/IndexedDbStore';
import PageSummarySubscription from './PageSummarySubscription';
import OpenAIAPI from '../data/OpenAIAPI';

describe('PageSummarySubscription', () => {
  beforeEach(async () => {
    await IndexedDbStore.summary.clear();
    await IndexedDbStore.highlights.clear();
    await IndexedDbStore.config.clear();
    OpenAIAPI.summarize = jest.fn().mockResolvedValue(['Foobar', ['foo', 'bar']]);
  });

  it('emits the summary for the page when initializing', async () => {
    const summary = {
      url: 'http://localhost:3000',
      summary: 'Foobar',
      tags: ['foo', 'bar'],
      highlightIds: ['1234'],
      loading: false,
    };

    await IndexedDbStore.summary.add(summary);

    const emit = jest.fn();
    PageSummarySubscription({ pageUrl: 'http://localhost:3000' }, emit);

    await waitFor(() => expect(emit).toHaveBeenCalledWith({ summary }));
  });

  it('emits the summary for the page when highlights are modified', async () => {
    const summary = {
      url: 'http://localhost:3000',
      summary: 'Foobar',
      tags: ['foo', 'bar'],
      highlightIds: ['1234'],
      loading: false,
    };

    await IndexedDbStore.summary.add(summary);

    const emit = jest.fn();
    PageSummarySubscription({ pageUrl: 'http://localhost:3000' }, emit);

    await IndexedDbStore.highlights.add({
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

    await waitFor(() => expect(emit.mock.calls).toEqual([
      [{ summary }],
      [{ summary }],
    ]));
  });

  it('will not emit/generate a summary for a page if no api key is present', async () => {
    const emit = jest.fn();
    PageSummarySubscription({ pageUrl: 'http://localhost:3000' }, emit);
    await waitFor(() => expect(emit).not.toHaveBeenCalled());
  });

  it('will not emit/generate a summary for a page if the api key is invalid', async () => {
    await IndexedDbStore.config.bulkAdd([
      { name: 'valid', value: false, updatedAt: Date.now()},
      { name: 'openai-key', value: '1234', updatedAt: Date.now() },
    ]);

    const emit = jest.fn();
    PageSummarySubscription({ pageUrl: 'http://localhost:3000' }, emit);
    await waitFor(() => expect(emit).not.toHaveBeenCalled());
  });

  it('saves the summary in a loading state if it does not exist', async () => {
    await IndexedDbStore.config.bulkAdd([
      { name: 'valid', value: true, updatedAt: Date.now() },
      { name: 'openai-key', value: '1234', updatedAt: Date.now() },
    ]);

    const emit = jest.fn();
    const spy = jest.spyOn(IndexedDbStore.summary, 'put');
    PageSummarySubscription({ pageUrl: 'http://localhost:3000' }, emit);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        url: 'http://localhost:3000',
        loading: true,
        summary: null,
        tags: [],
        highlightIds: [],
      })
    });
  });

  it('generates the summary with openai if it needs updates (highlightIds has changed)', async () => {
    await IndexedDbStore.config.bulkAdd([
      { name: 'valid', value: true, updatedAt: Date.now() },
      { name: 'openai-key', value: '1234', updatedAt: Date.now() },
    ]);

    await IndexedDbStore.summary.add({
      url: 'http://localhost:3000',
      summary: null,
      tags: [],
      highlightIds: [],
      loading: false,
    });

    await IndexedDbStore.highlights.add({
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

    const emit = jest.fn();
    PageSummarySubscription({ pageUrl: 'http://localhost:3000' }, emit);

    await waitFor(() => {
      expect(emit).toHaveBeenCalledWith({
        summary: {
          url: 'http://localhost:3000',
          loading: false,
          summary: 'Foobar',
          tags: ['foo', 'bar'],
          highlightIds: ['1234'],
        },
      })
    });
  });

  it('saves and emits the summary without the loading state at the end', async () => {
    await IndexedDbStore.config.bulkAdd([
      { name: 'valid', value: true, updatedAt: Date.now() },
      { name: 'openai-key', value: '1234', updatedAt: Date.now() },
    ]);

    const emit = jest.fn();
    const spy = jest.spyOn(IndexedDbStore.summary, 'put');
    PageSummarySubscription({ pageUrl: 'http://localhost:3000' }, emit);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        url: 'http://localhost:3000',
        loading: true,
        summary: null,
        tags: [],
        highlightIds: [],
      })
    });
  });
});
