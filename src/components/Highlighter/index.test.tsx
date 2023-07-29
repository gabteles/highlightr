import React from 'react';
import { render, screen } from '@testing-library/react';
import useSelectedText from '../../hooks/useSelectedText';
import usePositioner from '../../hooks/usePositioner';
import Highlighter from './index';

jest.mock('../../hooks/useSelectedText');
jest.mock('../../hooks/usePositioner');

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

  it.skip('adds a highlight when the button is clicked', () => {
    (useSelectedText as jest.Mock).mockReturnValue({
      text: 'Some text',
      range: new Range(),
    });
    (usePositioner as jest.Mock).mockReturnValue({ x: 100, y: 200 });

    render(<Highlighter />);
    screen.getByTestId('tooltip').click();

    // TODO
  })
});
