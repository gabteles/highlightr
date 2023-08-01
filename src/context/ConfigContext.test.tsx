import { act, render, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import ConfigContext, { ConfigProvider, ConfigStoreMux } from './ConfigContext';
import MuxMockController from '../util/test/MuxMockController';


describe('ConfigContext', () => {
  const getContext = () => {
    let result: { current: any } = { current: undefined };
    const TestElem = () => {
      result.current = useContext(ConfigContext);
      return <></>
    };

    render(
      <ConfigProvider>
        <TestElem />
      </ConfigProvider>
    );

    return result;
  }

  it('provides loading at first', () => {
    new MuxMockController(ConfigStoreMux);
    jest.spyOn(ConfigStoreMux.prototype, 'connect').mockImplementation(() => () => {});

    const result = getContext();
    expect(result.current.loading).toEqual(true);
  });

  it('stops loading when config is received', async () => {
    const controller = new MuxMockController(ConfigStoreMux);

    const result = getContext();
    expect(result.current.loading).toEqual(true);

    await controller.waitForSubscription();
    act(() => controller.emit({ config: { present: true, valid: true } }));
    expect(result.current.loading).toEqual(false);
  });

  it('starts loading when api key is set', async () => {
    const controller = new MuxMockController(ConfigStoreMux);

    const result = getContext();
    expect(result.current.loading).toEqual(true);

    await controller.waitForSubscription();
    act(() => controller.emit({ config: { present: true, valid: true } }));
    expect(result.current.loading).toEqual(false);

    act(() => result.current.setOpenAiKey('test'));
    expect(result.current.loading).toEqual(true);
  });

  it('sets the config to what is received', async () => {
    const controller = new MuxMockController(ConfigStoreMux);

    const result = getContext();
    expect(result.current.loading).toEqual(true);

    await controller.waitForSubscription();
    act(() => controller.emit({ config: { present: true, valid: true } }));
    expect(result.current.present).toEqual(true);
    expect(result.current.valid).toEqual(true);
  });
});
