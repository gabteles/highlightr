import { MutableRefObject, useEffect, useMemo, useState } from 'react';
import { autoUpdate, computePosition, autoPlacement, offset, inline } from '@floating-ui/dom';

type Props = {
  ref: MutableRefObject<HTMLElement | null>;
  range: Range | null;
}

type Return = {
  x: number;
  y: number;
} | null;

/**
 * Computes the position of a floating UI element.
 */
export default function usePositioner({ ref, range }: Props): Return {
  const [position, setPosition] = useState<Return>(null);

  const virtualEl = useMemo(() => {
    if (!range) return null;

    return {
      getBoundingClientRect: () => range.getBoundingClientRect(),
      getClientRects: () => range.getClientRects(),
    };
  }, [range]);

  useEffect(() => {
    if (!virtualEl || !ref.current) {
      setPosition(null);
      return;
    };

    return autoUpdate(virtualEl, ref.current, () => {
      if (!virtualEl || !ref.current) return;
      computePosition(virtualEl, ref.current, { middleware: [autoPlacement(), inline(), offset(10)] })
        .then(({ x, y }) => setPosition({ x, y }));
    });
  }, [virtualEl, ref]);

  return position;
}
