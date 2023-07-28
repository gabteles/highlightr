import { useEffect, useMemo, useRef, useState } from 'react';
import { computePosition, autoUpdate, inline, flip, offset } from '@floating-ui/dom';
import useConfig from '../../hooks/useConfig';
import useSelectedText from '../../hooks/useSelectedText';

export default function HighlightController() {
  const config = useConfig();
  const selection = useSelectedText();
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const virtualEl = useMemo(() => {
    const range = selection.range;
    if (!range) return null;

    return {
      getBoundingClientRect: () => range.getBoundingClientRect(),
      getClientRects: () => range.getClientRects(),
    };
  }, [selection.range]);

  useEffect(() => {
    if (!virtualEl || !tooltipRef.current) return () => {};

    return autoUpdate(
      virtualEl,
      tooltipRef.current,
      () => {
        if (!virtualEl || !tooltipRef.current) return;

        computePosition(
          virtualEl,
          tooltipRef.current,
          {
            middleware: [
              flip(),
              inline(),
              offset(10)
            ]
          }
        ).then(({ x, y }) => {
          setPosition({ x, y });
        });
      }
    );
  }, [virtualEl]);


  console.log(selection)
  if (!config.enabled) return null;

  return (
    <>
      <span ref={tooltipRef} className="fixed z-50 p-2 text-white bg-black rounded shadow" style={{ position: 'absolute', left: position.x, top: position.y }}>
        assd
      </span>
    </>
  );
}
