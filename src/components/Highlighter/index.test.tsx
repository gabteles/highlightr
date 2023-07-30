import React from 'react';
import { act, getByTestId, render, screen } from '@testing-library/react';
import useSelectedText from '../../hooks/useSelectedText';
import usePositioner from '../../hooks/usePositioner';
import useHighlightStore from '../../hooks/useHighlightStore';
import usePageMetadata from '../../hooks/usePageMetadata';
import Highlighter from './index';

jest.mock('../../hooks/useSelectedText');
jest.mock('../../hooks/usePositioner');
jest.mock('../../hooks/useHighlightStore');
jest.mock('../../hooks/usePageMetadata');

describe('Highlighter', () => {
  it('renders tooltip initially hidden', () => {
    render(<Highlighter />);
    expect(screen.getByTestId('tooltip')).toHaveStyle({ display: 'none' });
  });

  it('renders tooltip in the position specified by usePositioner when there is text selected', () => {
    (useSelectedText as jest.Mock).mockReturnValue({
      text: 'Some text',
      range: new Range(),
    });
    (usePositioner as jest.Mock).mockReturnValue({ x: 100, y: 200 });

    render(<Highlighter />);
    expect(screen.getByTestId('tooltip')).toHaveStyle({ display: 'block', left: '100px', top: '200px' });
  });

  it('adds a highlight when the button is clicked', () => {
    const saveHighlight = jest.fn();

    jest.useFakeTimers().setSystemTime(new Date('2023-07-29T00:00:00.000Z'));
    (usePositioner as jest.Mock).mockReturnValue({ x: 100, y: 200 });
    (useHighlightStore as jest.Mock).mockReturnValue({ saveHighlight });
    (usePageMetadata as jest.Mock).mockReturnValue({ canonical: 'https://example.com' });
    (useSelectedText as jest.Mock).mockImplementation(() => ({
      text: 'Some text',
      range: new Range(),
      container: screen.queryByTestId('selection-container'),
      anchorNode: screen.queryByTestId('anchor-node'),
      anchorOffset: 1,
      focusNode: screen.queryByTestId('focus-node'),
      focusOffset: 2,
    }));

    const { rerender } = render(
      <div id="a" data-testid='selection-container'>
        <span id="b" data-testid='anchor-node'>anchorNode</span>
        <span id="c" data-testid='focus-node'>focusNode</span>
      </div>
    );

    // Simulates the highligher being mounted after the selection has been made
    rerender(
      <>
        <Highlighter />
        <div id="a" data-testid='selection-container'>
          <span id="b" data-testid='anchor-node'>anchorNode</span>
          <span id="c" data-testid='focus-node'>focusNode</span>
        </div>
      </>
    );

    act(() => {
      screen.getByLabelText('highlightr').click();
    });

    expect(saveHighlight).toHaveBeenCalledWith({
      uuid: expect.any(String),
      text: 'Some text',
      createdAt: '2023-07-29T00:00:00.000Z',
      url: 'https://example.com',
      container: '#a',
      anchorNode: '#b',
      anchorOffset: 1,
      focusNode: '#c',
      focusOffset: 2,
    });
  })
});
