import React from 'react';
import { act, render, screen } from '@testing-library/react';
import PageSummary from './index';
import useHighlightStore from '../../hooks/useHighlightStore';
jest.mock('../../hooks/useHighlightStore');

describe('PageSummary', () => {
  let highlightStore!: { watchHighlights: jest.Mock };

  beforeEach(() => {
    highlightStore = {
      watchHighlights: jest.fn(),
    };

    (useHighlightStore as jest.Mock).mockReturnValue(highlightStore);
  });

  it('renders hidden at first', () => {
    render(<PageSummary />);
    expect(screen.getByTestId('highlights-summary')).toHaveStyle({
      bottom: '-88px',
      right: '-88px',
    });
  });

  it('renders visible when there are highlights', () => {
    render(<PageSummary />);
    act(() => {
      highlightStore.watchHighlights.mock.calls[0][1]([
        { uuid: '123', text: 'Some text', url: 'http://example.com', createdAt: '2023-01-01T00:00:00.000Z' },
      ])
    })
    expect(screen.getByTestId('highlights-summary')).toHaveStyle({
      bottom: '0px',
      right: '0px',
    });
  });

  it('opens the sidbar when clicked', () => {
    render(<PageSummary />);
    act(() => {
      highlightStore.watchHighlights.mock.calls[0][1]([
        { uuid: '123', text: 'Some text', url: 'http://example.com', createdAt: '2023-01-01T00:00:00.000Z' },
      ])
    })

    act(() => {
      screen.getByLabelText('Highlight summary').click();
    });

    expect(screen.getByTestId('highlights-summary')).toHaveStyle({
      clipPath: 'circle(100%)',
    });
  });
});
