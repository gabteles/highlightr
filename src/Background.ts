import HighlightStore from './data/HighlightStore';
import { IDatabaseChange } from 'dexie-observable/api';
import Demux from './util/communication/Demux';
import { Highlight } from './types/Highlight';

// Temporary
HighlightStore.highlights.clear();

const commPort = new Demux({
  commands: {
    'save-highlight': (payload: { highlight: Highlight }) => {
      HighlightStore.highlights.add(payload.highlight);
    },
  },
  subscriptions: {
    'page-highlights': ({ pageUrl }: { pageUrl: string }, emit) => {
      const getHighlightsForPage = async () => {
        const highlights = await HighlightStore.highlights
          .where('url')
          .equals(pageUrl)
          .toArray();

        emit({ highlights });
      };

      const listener = (changes: IDatabaseChange[]) => {
        let changed = false;
        for (const change of changes) {
          if (change.table !== 'highlights') continue;
          if (change.type === 1 && change.obj.url !== pageUrl) continue;
          if (change.type === 2 && change.obj.url !== pageUrl) continue;
          if (change.type === 3 && change.oldObj.url !== pageUrl) continue;
          changed = true;
          break;
        }

        if (changed) getHighlightsForPage();
      };

      HighlightStore.on('changes', listener);
      return () => HighlightStore.on('changes').unsubscribe(listener);
    },
  },
});

commPort.listen();

export {}
