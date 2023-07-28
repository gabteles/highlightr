import debounce from './debounce';

jest.useFakeTimers();

describe('debounce', () => {
  it('calls the callback once for multiple calls within the wait period', () => {
    const cb = jest.fn();
    const debounced = debounce(cb, 100);

    debounced();
    debounced();
    debounced();

    expect(cb).not.toBeCalled();

    jest.runAllTimers();

    expect(cb).toBeCalledTimes(1);
  });

  it('calls the callback multiple times if the wait period has passed', () => {
    const cb = jest.fn();
    const debounced = debounce(cb, 100);

    debounced();
    jest.runAllTimers();
    debounced();
    jest.runAllTimers();
    debounced(); // This won't be called immediately because the wait period hasn't passed yet

    expect(cb).toBeCalledTimes(2);
  });
});
