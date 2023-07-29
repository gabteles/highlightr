import React from 'react';
import { act, render, screen } from '@testing-library/react';
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

    (useSelectedText as jest.Mock).mockReturnValue({ text: 'Some text', range: new Range() });
    (usePositioner as jest.Mock).mockReturnValue({ x: 100, y: 200 });
    (useHighlightStore as jest.Mock).mockReturnValue({ saveHighlight });
    (usePageMetadata as jest.Mock).mockReturnValue({ canonical: 'https://example.com' });
    jest.useFakeTimers().setSystemTime(new Date('2023-07-29T00:00:00.000Z'));

    render(<Highlighter />);
    act(() => {
      screen.getByLabelText('highlightr').click();
    });

    expect(saveHighlight).toHaveBeenCalledWith({
      uuid: expect.any(String),
      text: 'Some text',
      createdAt: '2023-07-29T00:00:00.000Z',
      url: 'https://example.com',
    });
  })
});
