import { IDatabaseChange } from 'dexie-observable/api';
import HighlightStore from '../data/HighlightStore';
import { Config } from '../types/Config';

export default function GetConfigSubscription(_payload: {}, emit: (data: { config: Config }) => void) {
  const emitConfig = async () => {
    const config = await HighlightStore.config.toArray();
    emit({
      config: {
        valid: config.find((c) => c.name === 'valid')?.value as boolean,
        present: config.find((c) => c.name === 'openai-key')?.value !== undefined,
      }
    });
  };

  const listener = (changes: IDatabaseChange[]) => {
    const hasConfigChange = changes.some((change) => change.table === 'config');
    if (hasConfigChange) emitConfig();
  };

  emitConfig();
  HighlightStore.on('changes', listener);
  return () => HighlightStore.on('changes').unsubscribe(listener);
}
