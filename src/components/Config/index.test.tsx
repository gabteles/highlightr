import { render, screen } from '@testing-library/react';
import Config from '.';
import ConfigContext from '../../context/ConfigContext';
import userEvent from '@testing-library/user-event';

describe('Config', () => {
  it('renders the enable checkbox when showEnable is true', () => {
    render(<Config showEnable />)
    expect(screen.getByLabelText('Enable')).toBeInTheDocument();
  });

  it('sends the enabled state to the ConfigContext', () => {
    const context = {
      present: true,
      valid: true,
      enabled: false,
      loading: false,
      setOpenAiKey: jest.fn(),
      setEnabled: jest.fn(),
    };

    render(
      <ConfigContext.Provider value={context}>
        <Config showEnable />
      </ConfigContext.Provider>
    );

    const checkbox = screen.getByLabelText('Enable');
    userEvent.click(checkbox);
    expect(context.setEnabled).toHaveBeenCalledWith(true);
  });

  it('shows loading when context indicates it', () => {
    const context = {
      present: true,
      valid: true,
      enabled: false,
      loading: true,
      setOpenAiKey: jest.fn(),
      setEnabled: jest.fn(),
    };

    render(
      <ConfigContext.Provider value={context}>
        <Config showEnable />
      </ConfigContext.Provider>
    );

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });

  it('calls the context to save the key', () => {
    const context = {
      present: true,
      valid: true,
      enabled: false,
      loading: true,
      setOpenAiKey: jest.fn(),
      setEnabled: jest.fn(),
    };

    render(
      <ConfigContext.Provider value={context}>
        <Config showEnable />
      </ConfigContext.Provider>
    );

    const input = screen.getByTestId('openai-key-input');
    userEvent.type(input, 'test');
    userEvent.click(screen.getByTestId('submit'));
    expect(context.setOpenAiKey).toHaveBeenCalledWith('test');
  })
})
