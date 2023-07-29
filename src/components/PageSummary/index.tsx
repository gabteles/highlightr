import { useEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { css } from '@emotion/css';
import usePageMetadata from '../../hooks/usePageMetadata';
import useHighlightStore from '../../hooks/useHighlightStore';
import { Highlight } from '../../types/Highlight';
import SummaryIcon from './assets/summary.svg';

const navStyle = css`
  position: fixed;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 400px;
  z-index: 99999;
  overflow: hidden;
  transition: 0.5s ease-in-out;
  box-shadow: -8px 0 8px rgba(0, 0, 0, 0.2);
  user-select: none;
`;

const backgroundStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(2px);
`;

const contentWrapperStyle = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: flex-end;
  position: relative;
`;

const contentStyle = css`
  flex: 1;
`;

const toggleStyle = css`
  margin-right: 8px;
  margin-bottom: 8px;
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  text-align: center;

  svg {
    width: 24px;
    height: 24px;
    display: inline-block;
    fill: #fff;
  }
`;

export default function PageSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const { height } = useWindowSize();
  const pageMetadata = usePageMetadata();
  const store = useHighlightStore();
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    if (!pageMetadata.canonical) return;
    return store.watchHighlights(pageMetadata.canonical, setHighlights);
  }, [pageMetadata.canonical, store]);

  const isVisible = highlights.length > 0;

  return (
    <nav
      className={navStyle}
      style={{
        bottom: (isVisible || isOpen) ? '0px' : `-88px`,
        right: (isVisible || isOpen) ? '0px' : `-88px`,
        clipPath: isOpen ? 'circle(100%)' : `circle(24px at calc(400px - 24px - 8px) ${height - 24 - 8}px)`,
      }}
      data-testid="highlights-summary"
    >
      <div className={backgroundStyle} />
      <div className={contentWrapperStyle}>
        <div className={contentStyle}>

        </div>
        <button className={toggleStyle} onClick={() => setIsOpen(!isOpen)} aria-label="Highlight summary">
          <SummaryIcon />
        </button>
      </div>
    </nav>
  );
}
