import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Highlight } from '../../types/Highlight';
import HighlightList from '.';
import PageHighlightsContext from '../../context/PageHighlightsContext';

describe('HighlightList', () => {
  it('renders each highlight', () => {
    const highlights: Highlight[] = [
      {
        uuid: '1234',
        createdAt: new Date().toISOString(),
        text: 'Foobar',
        url: 'http://localhost:3000',
        container: '#container',
        anchorNode: '#anchorNode',
        anchorOffset: 0,
        focusNode: '#focusNode',
        focusOffset: 1,
      },
      {
        uuid: '5678',
        createdAt: new Date().toISOString(),
        text: 'Barfoo',
        url: 'http://localhost:3000',
        container: '#container',
        anchorNode: '#anchorNode',
        anchorOffset: 0,
        focusNode: '#focusNode',
        focusOffset: 1,
      },
    ];

    render(<HighlightList highlights={highlights} />);

    expect(screen.getByText('Foobar')).toBeInTheDocument();
    expect(screen.getByText('Barfoo')).toBeInTheDocument();
  });

  it.skip('renders no highlights message when there are no highlights', () => {
  });

  it('adds emphasis to the highlight when hovering a highlight and removes on unhover', () => {
    const pageHighlightsContext = {
      highlights: [],
      emphasis: [],
      addEmphasis: jest.fn(),
      removeEmphasis: jest.fn(),
    };

    const highlights: Highlight[] = [
      {
        uuid: '1234',
        createdAt: new Date().toISOString(),
        text: 'Foobar',
        url: 'http://localhost:3000',
        container: '#container',
        anchorNode: '#anchorNode',
        anchorOffset: 0,
        focusNode: '#focusNode',
        focusOffset: 1,
      },
    ];

    render(
      <PageHighlightsContext.Provider value={pageHighlightsContext}>
        <HighlightList highlights={highlights} />
      </PageHighlightsContext.Provider>
    );

    const highlight = screen.getByText('Foobar');
    userEvent.hover(highlight);
    expect(pageHighlightsContext.addEmphasis).toHaveBeenCalledWith('1234');
    userEvent.unhover(highlight);
    expect(pageHighlightsContext.removeEmphasis).toHaveBeenCalledWith('1234');
  });

  it('scrolls to the highlight when clicked', () => {
    const highlights: Highlight[] = [
      {
        uuid: '1234',
        createdAt: new Date().toISOString(),
        text: 'Foobar',
        url: 'http://localhost:3000',
        container: '#container',
        anchorNode: '#anchorNode',
        anchorOffset: 0,
        focusNode: '#focusNode',
        focusOffset: 1,
      },
    ];

    const elem = document.createElement('div');
    elem.scrollIntoView = jest.fn();
    const spy = jest.spyOn(document, 'querySelector').mockReturnValue(elem);

    render(<HighlightList highlights={highlights} />);
    const highlight = screen.getByText('Foobar');
    userEvent.click(highlight);

    expect(spy).toHaveBeenCalledWith('[data-highlight-id="1234"]');
    expect(elem.scrollIntoView).toHaveBeenCalled();
  });
});
