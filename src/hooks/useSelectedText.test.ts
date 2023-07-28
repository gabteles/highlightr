import { act, renderHook } from '@testing-library/react'
import useSelectedText from './useSelectedText';

describe('useSelectedText', () => {
  it('returns nothing initially', async () => {
    const { result } = renderHook(() => useSelectedText());
    expect(result.current.text).toBe(null);
    expect(result.current.range).toBe(null);
  });

  it('returns the text and node when a `selectionchange` event is fired', async () => {
    const { result } = renderHook(() => useSelectedText());

    const range = document.createRange();

    jest.spyOn(window, 'getSelection').mockReturnValueOnce({
      type: 'Range',
      anchorNode: document.createTextNode(''),
      anchorOffset: 0,
      focusNode: document.createTextNode(''),
      focusOffset: 0,
      isCollapsed: false,
      rangeCount: 1,
      addRange: jest.fn(),
      collapse: jest.fn(),
      collapseToEnd: jest.fn(),
      collapseToStart: jest.fn(),
      containsNode: jest.fn(),
      deleteFromDocument: jest.fn(),
      empty: jest.fn(),
      extend: jest.fn(),
      getRangeAt: jest.fn().mockReturnValue(range),
      removeAllRanges: jest.fn(),
      removeRange: jest.fn(),
      selectAllChildren: jest.fn(),
      setBaseAndExtent: jest.fn(),
      setPosition: jest.fn(),
      modify: jest.fn(),
      toString: jest.fn().mockReturnValue('Selected Text'),
    });

    act(() => {
      document.dispatchEvent(new Event('selectionchange'))
    });

    expect(result.current.text).toBe('Selected Text');
    expect(result.current.range).toBe(range);
  });

  it('returns nothing when a `selectionchange` event is fired but there is no selection', async () => {
    const { result } = renderHook(() => useSelectedText());

    jest.spyOn(window, 'getSelection').mockReturnValueOnce({
      type: 'Caret',
      anchorNode: document.createTextNode(''),
      anchorOffset: 0,
      focusNode: document.createTextNode(''),
      focusOffset: 0,
      isCollapsed: false,
      rangeCount: 1,
      addRange: jest.fn(),
      collapse: jest.fn(),
      collapseToEnd: jest.fn(),
      collapseToStart: jest.fn(),
      containsNode: jest.fn(),
      deleteFromDocument: jest.fn(),
      empty: jest.fn(),
      extend: jest.fn(),
      getRangeAt: jest.fn().mockReturnValue(null),
      removeAllRanges: jest.fn(),
      removeRange: jest.fn(),
      selectAllChildren: jest.fn(),
      setBaseAndExtent: jest.fn(),
      setPosition: jest.fn(),
      modify: jest.fn(),
      toString: jest.fn().mockReturnValue(''),
    });

    act(() => {
      document.dispatchEvent(new Event('selectionchange'))
    });

    expect(result.current.text).toBe(null);
    expect(result.current.range).toBe(null);
  });
})
