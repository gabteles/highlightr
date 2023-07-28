import { useEffect, useState } from 'react';

export default function useSelectedText() {
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    const listener = () => setSelection(window?.getSelection());
    document.addEventListener('selectionchange', listener);
    return () => document.removeEventListener('selectionchange', listener);
  }, []);

  return {
    text: selection?.toString() ?? '',
    node: selection?.anchorNode ?? null,
  };
}
