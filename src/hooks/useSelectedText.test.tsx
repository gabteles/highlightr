import { act, renderHook } from '@testing-library/react'
import useSelectedText from './useSelectedText';

describe('useSelectedText', () => {
  it('returns nothing initially', async () => {
    const { result } = renderHook(() => useSelectedText());
    expect(result.current.text).toBe('');
    expect(result.current.node).toBe(null);
  });

  it('returns gets the text and node when a `selectionchange` event is fired', async () => {
    const { result } = renderHook(() => useSelectedText());

    const anchorNode = document.createTextNode('');
    jest.spyOn(window, 'getSelection').mockReturnValueOnce({
      type: 'Range',
      anchorNode,
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
      getRangeAt: jest.fn(),
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
    expect(result.current.node).toBe(anchorNode);
  });
})
