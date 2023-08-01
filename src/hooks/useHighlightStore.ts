import { useEffect, useMemo, useRef } from 'react';
import { Highlight } from '../types/Highlight';
import Mux from '../util/communication/Mux';

type Return = {
  saveHighlight: (highlight: Highlight) => void;
  removeHighlight: (highlightId: string) => void;
  watchHighlights: (pageUrl: string, callback: (highlights: Highlight[]) => void) => () => void;
}

export class HighlightStoreMux extends Mux {
  saveHighlight(highlight: Highlight) {
    this.command('save-highlight', { highlight });
  }

  removeHighlight(highlightId: string) {
    this.command('delete-highlight', { highlightId });
  }

  watchHighlights(pageUrl: string, callback: (payload: { highlights: Highlight[] }) => void) {
    return this.subscribe<{ highlights: Highlight[] }>('page-highlights', { pageUrl }, callback);
  }
}

export default function useHighlightStore(): Return {
  const mux = useRef<HighlightStoreMux>(new HighlightStoreMux());
  useEffect(() => mux.current.connect(), []);

  const value: Return = useMemo(() => ({
    saveHighlight: (highlight) => mux.current.saveHighlight(highlight),
    removeHighlight: (highlightId) => mux.current.removeHighlight(highlightId),
    watchHighlights: (pageUrl, callback) => (
      mux.current.watchHighlights(pageUrl, (payload) => callback(payload.highlights))
    ),
  }), []);

  return value;
}
