import { useEffect, useRef, useState } from 'react';
import Mux from '../util/communication/Mux';
import usePageMetadata from './usePageMetadata';
import { PageSummary } from '../types/PageSummary';

type Props = {
  fetch: boolean;
};

class SummaryMux extends Mux {
  watchPageSummary(pageUrl: string, callback: (payload: PageSummary) => void) {
    return this.subscribe<{ summary: PageSummary }>('page-summary', { pageUrl }, (payload) => {
      callback(payload.summary);
    });
  }
}

export default function usePageSummary({ fetch }: Props): PageSummary {
  const page = usePageMetadata();
  const [value, setValue] = useState<PageSummary>({
    url: '',
    loading: true,
    summary: null,
    tags: [],
    highlightIds: [],
  });
  const mux = useRef<SummaryMux>(new SummaryMux());

  useEffect(() => {
    if (!fetch) return;
    return mux.current.connect();
  }, [fetch]);

  useEffect(() => {
    if (!page.canonical || !fetch) return;
    return mux.current.watchPageSummary(page.canonical, setValue);
  }, [page, fetch]);

  return value;
}
