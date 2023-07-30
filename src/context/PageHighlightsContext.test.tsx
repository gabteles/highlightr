import { act, render } from '@testing-library/react';
import { useContext } from 'react';
import PageHighlightsContext, { PageHighlightsProvider } from './PageHighlightsContext';
import useHighlightStore from '../hooks/useHighlightStore';
import { Highlight } from '../types/Highlight';
jest.mock('../hooks/useHighlightStore');

describe('PageHighlightsContext', () => {
  let highlightStore!: { watchHighlights: jest.Mock };

  beforeEach(() => {
    highlightStore = {
      watchHighlights: jest.fn(),
    };

    (useHighlightStore as jest.Mock).mockReturnValue(highlightStore);
  });

  it('provides no highlights at first', () => {
    let result: any;
    const TestElem = () => {
      result = useContext(PageHighlightsContext);
      return <></>
    };

    render(
      <PageHighlightsProvider>
        <TestElem />
      </PageHighlightsProvider>
    )

    expect(result.highlights).toEqual([]);
  });

  it('provides highlights when they are added', () => {
    const highlight: Highlight = {
      uuid: '1234',
      createdAt: new Date().toISOString(),
      text: 'Foobar',
      url: 'http://localhost:3000',
      container: '#container',
      anchorNode: '#anchorNode',
      anchorOffset: 0,
      focusNode: '#focusNode',
      focusOffset: 1,
    };

    let result: any;
    const TestElem = () => {
      result = useContext(PageHighlightsContext);
      return <></>
    };

    render(
      <PageHighlightsProvider>
        <TestElem />
      </PageHighlightsProvider>
    )

    act(() => {
      highlightStore.watchHighlights.mock.calls[0][1]([highlight])
    });

    expect(result.highlights).toEqual([highlight]);
  });

  it('provides controls emphasis', () => {
    const highlight: Highlight = {
      uuid: '1234',
      createdAt: new Date().toISOString(),
      text: 'Foobar',
      url: 'http://localhost:3000',
      container: '#container',
      anchorNode: '#anchorNode',
      anchorOffset: 0,
      focusNode: '#focusNode',
      focusOffset: 1,
    };

    let result: any;
    const TestElem = () => {
      result = useContext(PageHighlightsContext);
      return <></>
    };

    render(
      <PageHighlightsProvider>
        <TestElem />
      </PageHighlightsProvider>
    )

    expect(result.emphasis).toEqual([]);

    act(() => {
      result.addEmphasis(highlight.uuid);
    });

    expect(result.emphasis).toEqual([highlight.uuid]);

    act(() => {
      result.removeEmphasis(highlight.uuid);
    });

    expect(result.emphasis).toEqual([]);
  });
});
