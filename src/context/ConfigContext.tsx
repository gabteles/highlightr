import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import Mux from '../util/communication/Mux';

type Props = {
  children: React.ReactNode;
}

type ConfigContextType = {
  loading: boolean;
  enabled: boolean;
  present: boolean;
  valid: boolean;
  setOpenAiKey: (key: string) => void;
  setEnabled: (enabled: boolean) => void;
}

const ConfigContext = createContext<ConfigContextType>({
  loading: true,
  enabled: false,
  present: false,
  valid: false,
  setOpenAiKey: () => {},
  setEnabled: () => {},
});

export default ConfigContext;

export class ConfigStoreMux extends Mux {
  setOpenAiKey(key: string) {
    this.command('set-openai-key', { key });
  }

  setEnabled(enabled: boolean) {
    this.command('set-enabled', { enabled });
  }

  get(callback: (payload: { config: { enabled: boolean, present: boolean, valid: boolean } }) => void) {
    return this.subscribe<{ config: { enabled: boolean, present: boolean, valid: boolean } }>('get-config', {}, callback);
  }
}

export function ConfigProvider({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<{ enabled: boolean, present: boolean, valid: boolean }>({
    enabled: true,
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
    enabled: config.enabled,
    present: config.present,
    valid: config.valid,
    setOpenAiKey: (key: string) => {
      mux.current.setOpenAiKey(key);
      setLoading(true);
    },
    setEnabled: (enabled: boolean) => {
      mux.current.setEnabled(enabled);
    }
  }), [loading, config]);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  )
}
