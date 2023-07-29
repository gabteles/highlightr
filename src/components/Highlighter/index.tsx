import { useRef } from 'react';
import { css } from '@emotion/css';
import { v4 as uuidv4 } from 'uuid';
import useSelectedText from '../../hooks/useSelectedText';
import usePositioner from '../../hooks/usePositioner';
import HighlightIcon from './assets/highlight.svg';
import useHighlightStore from '../../hooks/useHighlightStore';
import usePageMetadata from '../../hooks/usePageMetadata';

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
  const store = useHighlightStore();
  const pageMetadata = usePageMetadata();
  const hasSelection = !!selection?.text;

  const onHighlight = () => {
    if (!selection?.text) return;

    store.saveHighlight({
      uuid: uuidv4(),
      text: selection.text,
      createdAt: new Date().toISOString(),
      url: pageMetadata.canonical,
    });
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
      <button onClick={onHighlight} aria-label="highlightr">
        <HighlightIcon />
      </button>
    </span>
  );
}
