import { useMemo, useRef } from 'react';
import useConfig from '../../hooks/useConfig';
import useSelectedText from '../../hooks/useSelectedText';
import usePositioner from '../../hooks/usePositioner';
import TooltipActions from '../TooltipActions';

export default function HighlightController() {
  const config = useConfig();
  const selection = useSelectedText();
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const position = usePositioner({ ref: tooltipRef, range: selection.range });

  const visible = useMemo(() => {
    if (!config.enabled) return false;
    if (!position) return false;
    return true;
  }, [config.enabled, position]);

  return (
    <span
      ref={tooltipRef}
      style={{
        display: visible ? 'block' : 'none',
        position: 'absolute',
        left: position?.x,
        top: position?.y,
        zIndex: 9999,
      }}
    >
      <TooltipActions />
    </span>
  );
}
