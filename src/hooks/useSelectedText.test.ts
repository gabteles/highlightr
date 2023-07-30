import { act, renderHook } from '@testing-library/react'
import useSelectedText from './useSelectedText';

describe('useSelectedText', () => {
  it('returns nothing initially', async () => {
    const { result } = renderHook(() => useSelectedText());
    expect(result.current).toEqual({
      text: null,
      range: null,
      container: null,
      anchorNode: null,
      anchorOffset: null,
      focusNode: null,
      focusOffset: null,
    });
  });

  it('returns selection data when a `mouseup` event is fired', async () => {
    const { result } = renderHook(() => useSelectedText());

    const range = document.createRange();
    const anchorNode = document.createTextNode('');
    const focusNode = document.createTextNode('');

    const commonAncestorContainer = document.createElement('div');
    Object.defineProperty(range, 'commonAncestorContainer', { value: commonAncestorContainer });

    jest.spyOn(window, 'getSelection').mockReturnValueOnce({
      type: 'Range',
      anchorNode,
      anchorOffset: 10,
      focusNode,
      focusOffset: 20,
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
      document.dispatchEvent(new Event('mouseup'))
    });

    expect(result.current).toEqual({
      text: 'Selected Text',
      range,
      container: commonAncestorContainer,
      anchorNode,
      anchorOffset: 10,
      focusNode,
      focusOffset: 20,
    });
  });

  it('returns nothing when a `mouseup` event is fired but there is no selected text', async () => {
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
      document.dispatchEvent(new Event('mouseup'))
    });

    expect(result.current).toEqual({
      text: null,
      range: null,
      container: null,
      anchorNode: null,
      anchorOffset: null,
      focusNode: null,
      focusOffset: null,
    });
  });
})
