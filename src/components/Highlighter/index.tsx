import { useRef, useState } from 'react';
import { css } from '@emotion/css';
import useSelectedText from '../../hooks/useSelectedText';
import usePositioner from '../../hooks/usePositioner';
import HighlightIcon from './assets/highlight.svg';

const tooltipStyle = css`
  position: absolute;
  z-index: 9999;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 8px 5px;

    svg {
      width: 24px;
      height: 24px;
      fill: #fff;
    }
  }
`;

export default function Highlighter() {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const selection = useSelectedText();
  const position = usePositioner({ range: selection?.range, ref: tooltipRef });
  const hasSelection = !!selection?.text;

  const onHighlight = () => {
    if (!selection) return;
    alert(`Highlighting: ${selection.text}`);
  };

  return (
    <span
      ref={tooltipRef}
      className={tooltipStyle}
      style={{
        display: hasSelection ? 'block' : 'none',
        left: position?.x,
        top: position?.y,
      }}
      data-testid="tooltip"
    >
      <button onClick={onHighlight}>
        <HighlightIcon />
      </button>
    </span>
  );
}
