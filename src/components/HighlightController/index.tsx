import { useRef } from 'react';
import useConfig from '../../hooks/useConfig';
import useSelectedText from '../../hooks/useSelectedText';
import usePositioner from '../../hooks/usePositioner';

export default function HighlightController() {
  const config = useConfig();
  const selection = useSelectedText();
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const position = usePositioner({ ref: tooltipRef, range: selection.range });

  if (!config.enabled) return null;
  if (!position) return null;

  return (
    <>
      <span
        ref={tooltipRef}
        className="fixed z-50 p-2 text-white bg-black rounded shadow"
        style={{ position: 'absolute', left: position.x, top: position.y }}
      >
        assd
      </span>
    </>
  );
}
