import { useEffect, useState } from 'react';
import debounce from '../util/debounce';

export default function useSelectedText() {
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    const listener = debounce(() => setSelection(window?.getSelection()));
    document.addEventListener('selectionchange', listener);
    return () => document.removeEventListener('selectionchange', listener);
  }, []);

  return {
    text: selection?.toString() ?? '',
    node: selection?.anchorNode ?? null,
  };
}
