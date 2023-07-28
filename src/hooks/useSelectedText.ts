import { useEffect, useState } from 'react';

type Return = {
  text: null | string;
  range: null | Range;
}

/**
 * Gets the selected text and its range.
 * Ref.: https://developer.mozilla.org/en-US/docs/Web/API/Selection
 */
export default function useSelectedText(): Return {
  const [value, setValue] = useState<Return>({ text: null, range: null });

  useEffect(() => {
    const listener = () => {
      const selection = window?.getSelection();
      const hasSelection = !!selection?.toString();

      if (!hasSelection) {
        setValue({ text: null, range: null });
        return;
      }

      setValue({
        text: selection?.toString() ?? null,
        range: selection?.getRangeAt(0) ?? null
      })
    };

    document.addEventListener('selectionchange', listener);
    return () => document.removeEventListener('selectionchange', listener);
  }, []);

  return value;;
}
