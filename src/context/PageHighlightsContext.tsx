import { createContext, useCallback, useEffect, useState } from 'react';
import useHighlightStore from '../hooks/useHighlightStore';
import usePageMetadata from '../hooks/usePageMetadata';
import { Highlight } from '../types/Highlight';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  highlights: Highlight[];
  emphasis: string[];
  addEmphasis: (uuid: string) => void;
  removeEmphasis: (uuid: string) => void;
};

const PageHighlightsContext = createContext<ContextType>({
  highlights: [],
  emphasis: [],
  addEmphasis: () => {},
  removeEmphasis: () => {},
});

export default PageHighlightsContext;

export function PageHighlightsProvider({ children }: Props) {
  const pageMetadata = usePageMetadata();
  const store = useHighlightStore();
  const [emphasis, setEmphasis] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // TODO: Instead of using effect, pass the pageMetadata.canonical to the store
  useEffect(() => {
    if (!pageMetadata.canonical) return;
    return store.watchHighlights(pageMetadata.canonical, setHighlights);
  }, [pageMetadata.canonical, store]);

  const addEmphasis = useCallback((uuid: string) => {
    setEmphasis((prev) => [...prev, uuid]);
  }, []);

  const removeEmphasis = useCallback((uuid: string) => {
    setEmphasis((prev) => prev.filter((id) => id !== uuid));
  }, []);

  const value = {
    highlights,
    emphasis,
    addEmphasis,
    removeEmphasis,
  };

  return (
    <PageHighlightsContext.Provider value={value}>
      {children}
    </PageHighlightsContext.Provider>
  );
}
