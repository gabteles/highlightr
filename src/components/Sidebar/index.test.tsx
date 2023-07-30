import React from 'react';
import { act, render, screen } from '@testing-library/react';
import Sidebar from './index';
import PageHighlightsContext from '../../context/PageHighlightsContext';
import { Highlight } from '../../types/Highlight';
import { SidebarContextProvider } from '../../context/SidebarContext';

describe('Sidebar', () => {
  const baseValue = {
    highlights: [],
    emphasis: [],
    addEmphasis: jest.fn(),
    removeEmphasis: jest.fn(),
  };

  it('renders hidden at first', () => {
    render(
      <PageHighlightsContext.Provider value={{ ...baseValue, highlights: [] }}>
        <Sidebar />
      </PageHighlightsContext.Provider>
    );
    expect(screen.getByTestId('highlights-summary')).toHaveStyle({
      bottom: '-88px',
      right: '-88px',
    });
  });

  it('renders visible when there are highlights', () => {
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

    render(
      <PageHighlightsContext.Provider value={{ ...baseValue, highlights: [highlight] }}>
        <Sidebar />
      </PageHighlightsContext.Provider>
    );

    expect(screen.getByTestId('highlights-summary')).toHaveStyle({
      bottom: '0px',
      right: '0px',
    });
  });

  it('opens the sidbar when clicked', () => {
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

    render(
      <SidebarContextProvider>
        <PageHighlightsContext.Provider value={{ ...baseValue, highlights: [highlight] }}>
          <Sidebar />
        </PageHighlightsContext.Provider>
      </SidebarContextProvider>
    );

    act(() => {
      screen.getByLabelText('Highlight summary').click();
    });

    expect(screen.getByTestId('highlights-summary')).toHaveStyle({
      clipPath: 'circle(100%)',
    });
  });
});
