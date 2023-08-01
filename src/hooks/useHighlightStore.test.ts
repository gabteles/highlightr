import { renderHook, act, waitFor } from '@testing-library/react';
import useHighlightStore, { HighlightStoreMux } from './useHighlightStore';
import MuxMockController from '../util/test/MuxMockController';

describe('useHighlightStore', () => {
  it('connects and subscribes when instantiated', async () => {
    const controller = new MuxMockController(HighlightStoreMux);
    renderHook(() => useHighlightStore());

    await controller.waitForConnection();
  });

  it('sends the correct command when saving the highlight', async () => {
    const controller = new MuxMockController(HighlightStoreMux);
    const { result } = renderHook(() => useHighlightStore());

    const highlight = {
      createdAt: new Date().toISOString(),
      text: 'Foobar',
      url: 'http://localhost:3000',
      container: '#container',
      anchorNode: '#anchorNode',
      anchorOffset: 0,
      focusNode: '#focusNode',
      focusOffset: 1,
    };

    await controller.waitForConnection();
    result.current.saveHighlight(highlight);
    await controller.waitForCommand('save-highlight', { highlight });
  });

  it('subscribes to highlights for a page', async () => {
    const controller = new MuxMockController(HighlightStoreMux);
    const { result } = renderHook(() => useHighlightStore());
    await controller.waitForConnection();
    const callback = jest.fn();
    result.current.watchHighlights('http://localhost:3000', callback);
    await controller.waitForSubscription('page-highlights');
    act(() => controller.emit({ highlights: [] }));
    await waitFor(() => expect(callback).toHaveBeenCalledWith([]));
  });
});
