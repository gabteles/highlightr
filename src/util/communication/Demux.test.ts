import Demux from './Demux';

describe('Demux', () => {
  it('doesnt connect when constructed', () => {
    chrome.runtime.onConnect.addListener = jest.fn();
    new Demux({ commands: {}, subscriptions: {} });
    expect(chrome.runtime.onConnect.addListener).not.toHaveBeenCalled();
  });

  it('connects when listen() is called', () => {
    const demux = new Demux({ commands: {}, subscriptions: {} });
    chrome.runtime.onConnect.addListener = jest.fn();
    demux.listen();
    expect(chrome.runtime.onConnect.addListener).toHaveBeenCalled();
  });

  it('returns a disconnect callback when listen() is called', () => {
    const demux = new Demux({ commands: {}, subscriptions: {} });
    chrome.runtime.onConnect.addListener = jest.fn();
    chrome.runtime.onConnect.removeListener = jest.fn();
    const cb = demux.listen();
    cb();
    expect(chrome.runtime.onConnect.removeListener).toHaveBeenCalled();
  });

  it('calls the command callback when a command is received', () => {
    const commands = { 'test-command-1': jest.fn() };
    const demux = new Demux({ commands, subscriptions: {} });

    const addListener = jest.fn();
    chrome.runtime.onConnect.addListener = jest.fn().mockImplementation(cb => cb({ onMessage: { addListener } }));
    demux.listen();

    addListener.mock.calls[0][0]({ type: 'test-command-1', payload: undefined });
    expect(commands['test-command-1']).toHaveBeenCalled();
    addListener.mock.calls[0][0]({ type: 'test-command-1', payload: { foo: 'bar' } });
    expect(commands['test-command-1']).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('calls the subscription callback when a subscription is received', () => {
    const subscriptions = { 'test-event': jest.fn() };
    const demux = new Demux({ commands: {}, subscriptions });

    const addListener = jest.fn();
    chrome.runtime.onConnect.addListener = jest.fn().mockImplementation(cb => cb({ onMessage: { addListener } }));
    demux.listen();

    addListener.mock.calls[0][0]({ type: 'subscribe', event: 'test-event', payload: { foo: 'bar' }, subscriptionId: 'test-subscription-id' });
    expect(subscriptions['test-event']).toHaveBeenCalledWith({ foo: 'bar' }, expect.any(Function));
  });

  it('calls the subscription emit callback when a subscription generates new data', () => {
    const subscriptions = { 'test-event': jest.fn() };
    const demux = new Demux({ commands: {}, subscriptions });

    const addListener = jest.fn();
    const postMessage = jest.fn();
    chrome.runtime.onConnect.addListener = jest.fn().mockImplementation(cb => cb({ onMessage: { addListener }, postMessage }));
    demux.listen();

    addListener.mock.calls[0][0]({ type: 'subscribe', event: 'test-event', payload: { foo: 'bar' }, subscriptionId: 'test-subscription-id' });
    const emit = subscriptions['test-event'].mock.calls[0][1]
    emit({ foobar: 'baz' });

    expect(postMessage).toHaveBeenCalledWith({ subscriptionId: 'test-subscription-id', payload: { foobar: 'baz' } });
  });

  it('calls the subscription unregister callback when an unsubscribe is received', () => {
    const unsubscribe = jest.fn();
    const subscriptions = { 'test-event': jest.fn().mockReturnValue(unsubscribe) };
    const demux = new Demux({ commands: {}, subscriptions });

    const addListener = jest.fn();
    chrome.runtime.onConnect.addListener = jest.fn().mockImplementation(cb => cb({ onMessage: { addListener } }));
    demux.listen();

    addListener.mock.calls[0][0]({ type: 'subscribe', event: 'test-event', payload: { foo: 'bar' }, subscriptionId: 'test-subscription-id' });
    addListener.mock.calls[0][0]({ type: 'unsubscribe', subscriptionId: 'test-subscription-id' });

    expect(unsubscribe).toHaveBeenCalled();
  });
});
