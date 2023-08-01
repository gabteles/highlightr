import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import Mux from '../util/communication/Mux';

type Props = {
  children: React.ReactNode;
}

type ConfigContextType = {
  loading: boolean;
  present: boolean;
  valid: boolean;
  setOpenAiKey: (key: string) => void;
}

const ConfigContext = createContext<ConfigContextType>({
  loading: true,
  present: false,
  valid: false,
  setOpenAiKey: () => {},
});

export default ConfigContext;

export class ConfigStoreMux extends Mux {
  setOpenAiKey(key: string) {
    this.command('set-openai-key', { key });
  }

  get(callback: (payload: { config: { present: boolean, valid: boolean } }) => void) {
    return this.subscribe<{ config: { present: boolean, valid: boolean } }>('get-config', {}, callback);
  }
}

export function ConfigProvider({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<{ present: boolean, valid: boolean }>({
    present: false,
    valid: false,
  });

  const mux = useRef<ConfigStoreMux>(new ConfigStoreMux());

  useEffect(() => {
    const disconnectMux = mux.current.connect();
    const cancelSubscription = mux.current.get((payload) => {
      setConfig(payload.config);
      setLoading(false);
    });

    return () => {
      cancelSubscription();
      disconnectMux();
    };
  }, []);


  const contextValue = useMemo(() => ({
    loading,
    present: config.present,
    valid: config.valid,
    setOpenAiKey: (key: string) => {
      mux.current.setOpenAiKey(key);
      setLoading(true);
    },
  }), [loading, config]);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  )
}
