import { renderHook, waitFor } from '@testing-library/react';
import usePositioner from './usePositioner';
import floatingUI from '@floating-ui/dom';

describe('usePositioner', () => {
  it('without a range it returns nothing', async () => {
    const el = document.createElement('div');
    const { result } = renderHook(() => usePositioner({ ref: { current: el }, range: null }));
    expect(result.current).toBe(null);
  });

  it('without a ref it returns nothing', async () => {
    const range = document.createRange();
    const { result } = renderHook(() => usePositioner({ ref: { current: null }, range }));
    expect(result.current).toBe(null);
  });

  it('returns the position of the range relative to the ref using floating-ui', async () => {
    /**
     * This test is not really testing the placement of the element, but rather
     * that the `usePositioner` hook is calling the `computePosition` function
     * from the `floating-ui` package.
     *
     * We assume that the `computePosition` function is tested in the `floating-ui` package.
     */
    const el = document.createElement('div');
    const range = new Range();
    range.getBoundingClientRect = jest.fn();
    range.getClientRects = () => ({ item: () => null, length: 0, [Symbol.iterator]: jest.fn() });

    jest.spyOn(floatingUI, 'computePosition').mockResolvedValue({ x: 0, y: 0, placement: 'top', strategy: 'absolute', middlewareData: {} });
    jest.spyOn(floatingUI, 'autoUpdate').mockImplementation((_el: unknown, _ref: unknown, cb: Function) => cb())

    const { result, rerender } = renderHook(() => usePositioner({ ref: { current: el }, range }));

    expect(result.current).toBe(null);
    rerender();
    await waitFor(() => expect(result.current).toEqual({ x: 0, y: 0 }));
  });
});
