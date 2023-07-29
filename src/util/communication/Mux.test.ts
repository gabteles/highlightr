import Mux from './Mux';

describe('Mux', () => {
  it('doesnt connect when constructed', () => {
    new Mux();
    expect(chrome.runtime.connect).not.toBeCalled();
  })

  it('connects when connect() is called', () => {
    const mux = new Mux();
    const addListener = jest.fn();
    chrome.runtime.connect = jest.fn().mockReturnValue({ onMessage: { addListener } });
    mux.connect();
    expect(chrome.runtime.connect).toBeCalled();
  });

  it('returns a disconnect callback when connect() is called', () => {
    const mux = new Mux();
    const disconnect = jest.fn();
    chrome.runtime.connect = jest.fn().mockReturnValue({ onMessage: { addListener: jest.fn() }, disconnect });
    const cb = mux.connect();
    cb();
    expect(disconnect).toBeCalled();
  });

  it('sends a command in standardized format', () => {
    const mux = new Mux();
    const postMessage = jest.fn();
    chrome.runtime.connect = jest.fn().mockReturnValue({ onMessage: { addListener: jest.fn() }, postMessage });
    mux.connect();
    mux.command('test-command-1');
    mux.command('test-command-2', { test: 'payload' });
    expect(postMessage).toBeCalledWith({ type: 'test-command-1', payload: undefined });
    expect(postMessage).toBeCalledWith({ type: 'test-command-2', payload: { test: 'payload' } });
  });

  it('sends a subscribe command in standardized format', () => {
    const mux = new Mux();
    const postMessage = jest.fn();
    chrome.runtime.connect = jest.fn().mockReturnValue({ onMessage: { addListener: jest.fn() }, postMessage });
    mux.connect();
    mux.subscribe('test-event', { test: 'payload' }, jest.fn());
    expect(postMessage).toBeCalledWith({ type: 'subscribe', event: 'test-event', payload: { test: 'payload' }, subscriptionId: expect.any(String) });
  });

  it('sends an unsubscribe command in standardized format', () => {
    const mux = new Mux();
    const postMessage = jest.fn();
    chrome.runtime.connect = jest.fn().mockReturnValue({ onMessage: { addListener: jest.fn() }, postMessage });
    mux.connect();
    const disconnect = mux.subscribe('test-event', { test: 'payload' }, jest.fn());
    disconnect();
    expect(postMessage).toBeCalledWith({ type: 'unsubscribe', subscriptionId: expect.any(String) });
  });

  it('calls the callback when a message is received', () => {
    const mux = new Mux();
    const addListener = jest.fn();
    const postMessage = jest.fn();
    chrome.runtime.connect = jest.fn().mockReturnValue({ onMessage: { addListener }, postMessage });
    mux.connect();

    const cb = jest.fn();
    mux.subscribe('test-event', { test: 'payload' }, cb);
    addListener.mock.calls[0][0]({
      subscriptionId: postMessage.mock.calls[0][0].subscriptionId,
      payload: { test: 'payload' },
    });

    expect(cb).toBeCalledWith({ test: 'payload' });
  })
});
