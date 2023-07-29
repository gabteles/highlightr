import { IDatabaseChange } from 'dexie-observable/api';
import HighlightStore from '../data/HighlightStore';
import { Highlight } from '../types/Highlight';

export default function PageHighlightsSubscription(
  payload: { pageUrl: string },
  emit: (data: { highlights: Highlight[] }) => void,
) {
  const emitHighlightsForPage = async () => {
    const highlights = await HighlightStore.highlights.where('url').equals(payload.pageUrl).toArray();
    emit({ highlights });
  };

  const listener = (changes: IDatabaseChange[]) => {
    let changed = false;

    for (const change of changes) {
      if (change.table !== 'highlights') continue;
      if (change.type === 1 && change.obj.url !== payload.pageUrl) continue;
      if (change.type === 2 && change.obj.url !== payload.pageUrl) continue;
      if (change.type === 3 && change.oldObj.url !== payload.pageUrl) continue;
      changed = true;
      break;
    }

    if (changed) emitHighlightsForPage();
  };

  emitHighlightsForPage();
  HighlightStore.on('changes', listener);
  return () => HighlightStore.on('changes').unsubscribe(listener);
}
