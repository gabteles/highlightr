import { renderHook, act } from '@testing-library/react';
import usePageSummary, { SummaryMux } from './usePageSummary';
import MuxMockController from '../util/test/MuxMockController';

describe('usePageSummary', () => {
  it('returns a loading, blank summary', () => {
    const { result } = renderHook(() => usePageSummary({ fetch: false }));
    expect(result.current.loading).toEqual(true);
    expect(result.current.summary).toEqual(null);
  });

  it('when able to fetch, connects and subscribes', async () => {
    const controller = new MuxMockController(SummaryMux);
    renderHook(() => usePageSummary({ fetch: true }));

    await controller.waitForConnection();
    await controller.waitForSubscription('page-summary');
  });

  it('returns the summary when fetched', async () => {
    const controller = new MuxMockController(SummaryMux);
    const { result } = renderHook(() => usePageSummary({ fetch: true }));

    await controller.waitForConnection();
    await controller.waitForSubscription('page-summary');

    const summary = {
      url: 'http://localhost:3000',
      loading: false,
      summary: 'This is a summary',
      tags: ['foo', 'bar'],
      highlightIds: ['1234'],
    };

    act(() => controller.emit({ summary }));
    expect(result.current).toEqual(summary);
  });
});
