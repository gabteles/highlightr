import { render, screen } from '@testing-library/react';
import Summary from '.';
import usePageSummary from '../../hooks/usePageSummary';
import ConfigContext from '../../context/ConfigContext';
jest.mock('../../hooks/usePageSummary');

describe('Summary', () => {
  const baseConfigContext = {
    present: true,
    valid: true,
    enabled: false,
    loading: false,
    setOpenAiKey: jest.fn(),
    setEnabled: jest.fn(),
  };

  it('renders config box when config is missing', () => {
    (usePageSummary as jest.Mock).mockReturnValue({
      url: '',
      loading: true,
      summary: null,
      tags: [],
      highlightIds: [],
    });

    const context = {
      present: false,
      valid: false,
      enabled: false,
      loading: false,
      setOpenAiKey: jest.fn(),
      setEnabled: jest.fn(),
    };

    render(
      <ConfigContext.Provider value={{ ...baseConfigContext, present: false }}>
        <Summary />
      </ConfigContext.Provider>
    );

    expect(screen.getByTestId('config')).toBeInTheDocument();
  });

  it('renders loading when page summary is loading', () => {
    (usePageSummary as jest.Mock).mockReturnValue({
      url: '',
      loading: true,
      summary: null,
      tags: [],
      highlightIds: [],
    });

    render(
      <ConfigContext.Provider value={baseConfigContext}>
        <Summary />
      </ConfigContext.Provider>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders the summary when page summary is loaded', async () => {
    (usePageSummary as jest.Mock).mockReturnValue({
      url: 'http://localhost:3000',
      loading: false,
      summary: 'Foo',
      tags: [],
      highlightIds: [],
    });

    render(
      <ConfigContext.Provider value={baseConfigContext}>
        <Summary />
      </ConfigContext.Provider>
    );
    expect(screen.getByText('Foo')).toBeInTheDocument();
  });

  it('renders the tags when page summary is loaded', () => {
    (usePageSummary as jest.Mock).mockReturnValue({
      url: 'http://localhost:3000',
      loading: false,
      summary: 'Foo',
      tags: ['bar', 'baz'],
      highlightIds: [],
    });

    render(
      <ConfigContext.Provider value={baseConfigContext}>
        <Summary />
      </ConfigContext.Provider>
    );

    expect(screen.getByText('#bar')).toBeInTheDocument();
    expect(screen.getByText('#baz')).toBeInTheDocument();
  });
})
