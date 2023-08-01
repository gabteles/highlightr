import { IDatabaseChange } from 'dexie-observable/api';
import { PageSummary } from '../types/PageSummary';
import HighlightStore from '../data/HighlightStore';
import OpenAIAPI from '../data/OpenAIAPI';

export default function PageSummarySubscription(
  payload: { pageUrl: string },
  emit: (data: { summary: PageSummary }) => void,
) {
  const getHighlights = () => HighlightStore.highlights.where('url').equals(payload.pageUrl).toArray();
  const getSummary = () => HighlightStore.summary.get(payload.pageUrl);
  const getApiKey = async (): Promise<string | undefined> => {
    const config = await HighlightStore.config.toArray();

    const valid = config.find((k) => k.name === 'valid')?.value as boolean;
    if (!valid) return undefined;

    const key = config.find((k) => k.name === 'openai-key');
    return key?.value as string | undefined;
  };

  // TODO: Instead of saving and emitting the summary, we should just save the summary.
  // The responsibility of emitting the summary should be in the db listener.
  const emitSummary = async () => {
    let summary = await getSummary();
    if (summary) emit({ summary });

    const apiKey = await getApiKey();
    if (!apiKey) return;

    if (!summary) {
      summary = {
        url: payload.pageUrl,
        loading: true,
        summary: null,
        tags: [],
        highlightIds: [],
      };


      HighlightStore.summary.put(summary);
    }

    const highlights = await getHighlights();
    const needsRefresh = (
      (summary.highlightIds.length !== highlights.length) ||
      highlights.some((h) => !summary?.highlightIds?.includes(h.uuid as string))
      );

    if (needsRefresh) {
      summary = { ...summary, loading: true };
      HighlightStore.summary.put(summary);
      emit({ summary });

      const [summarizedText, tags] = await OpenAIAPI.summarize(apiKey, highlights.map((h) => h.text));
      const highlightIds = highlights.map((h) => h.uuid as string);
      summary = {
        ...summary,
        summary: summarizedText,
        tags: tags,
        highlightIds: highlightIds,
      }
    }

    summary = { ...summary, loading: false };
    HighlightStore.summary.put(summary);
    emit({ summary });
  };

  const listener = (changes: IDatabaseChange[]) => {
    for (const change of changes) {
      if (change.table !== 'highlights') continue;
      if (change.type === 1 && change.obj.url !== payload.pageUrl) continue;
      if (change.type === 2 && change.obj.url !== payload.pageUrl) continue;
      if (change.type === 3 && change.oldObj.url !== payload.pageUrl) continue;
      // TODO: Handle changes to the openai-key config
      emitSummary();
    }
  };

  emitSummary();
  HighlightStore.on('changes', listener);
  return () => HighlightStore.on('changes').unsubscribe(listener);
}
