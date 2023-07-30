import { useEffect, useState } from 'react';

type Return = {
  text: null | string;
  range: null | Range;
  container: null | Node;
  anchorNode: Node | null;
  anchorOffset: number | null;
  focusNode: Node | null;
  focusOffset: number | null;
}

/**
 * Gets the selected text and its range.
 * Ref.: https://developer.mozilla.org/en-US/docs/Web/API/Selection
 */
export default function useSelectedText(): Return {
  const initialValue: Return = {
    text: null,
    range: null,
    container: null,
    anchorNode: null,
    anchorOffset: null,
    focusNode: null,
    focusOffset: null,
  };
  const [value, setValue] = useState<Return>(initialValue);

  useEffect(() => {
    const listener = () => {
      const selection = window?.getSelection();
      const hasSelection = !!selection?.toString();

      if (!hasSelection) {
        setValue(initialValue);
        return;
      }

      const range = selection?.getRangeAt(0);

      setValue({
        text: selection?.toString() ?? null,
        range: range ?? null,
        container: range?.commonAncestorContainer ?? null,
        anchorNode: selection?.anchorNode ?? null,
        anchorOffset: selection?.anchorOffset ?? null,
        focusNode: selection?.focusNode ?? null,
        focusOffset: selection?.focusOffset ?? null,
      })
    };

    document.addEventListener('mouseup', listener);
    return () => document.removeEventListener('mouseup', listener);
  }, [initialValue]);

  return value;;
}
