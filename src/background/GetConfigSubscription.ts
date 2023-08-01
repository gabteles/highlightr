import { IDatabaseChange } from 'dexie-observable/api';
import IndexedDbStore from '../data/IndexedDbStore';
import { Config } from '../types/Config';

export default function GetConfigSubscription(_payload: {}, emit: (data: { config: Config }) => void) {
  const emitConfig = async () => {
    const config = await IndexedDbStore.config.toArray();

    emit({
      config: {
        enabled: (config.find((c) => c.name === 'enabled')?.value as boolean) ?? true,
        valid: config.find((c) => c.name === 'valid')?.value as boolean,
        present: !!config.find((c) => c.name === 'openai-key')?.value,
      }
    });
  };

  const listener = (changes: IDatabaseChange[]) => {
    const hasConfigChange = changes.some((change) => change.table === 'config');
    if (hasConfigChange) emitConfig();
  };

  emitConfig();
  IndexedDbStore.on('changes', listener);
  return () => IndexedDbStore.on('changes').unsubscribe(listener);
}
