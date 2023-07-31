import { useContext } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { css } from '@emotion/css';
import SummaryIcon from './assets/summary.svg';
import HighlightList from '../HighlightList';
import PageHighlightsContext from '../../context/PageHighlightsContext';
import SidebarContext from '../../context/SidebarContext';
import Summary from '../Summary';

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
  background: rgba(255, 255, 255, 0.8);
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
  width: 100%;
`;

const contentInnerStyle = css`
  padding: 16px;
  height: 100%;
`;

const titleStyle = css`
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: bold;
  color: #000;

  &:not(:first-of-type) {
    margin-top: 24px;
  }
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
  border: 2px solid #000;

  svg {
    width: 24px;
    height: 24px;
    display: inline-block;
    fill: #000;
  }
`;

export default function Sidebar() {
  const sidebar = useContext(SidebarContext);
  const { highlights } = useContext(PageHighlightsContext);
  const { height } = useWindowSize();

  const isVisible = highlights.length > 0;

  return (
    <nav
      className={navStyle}
      style={{
        bottom: (isVisible || sidebar.isOpen) ? '0px' : `-88px`,
        right: (isVisible || sidebar.isOpen) ? '0px' : `-88px`,
        clipPath: sidebar.isOpen ? 'circle(100%)' : `circle(24px at calc(400px - 24px - 8px) ${height - 24 - 8}px)`,
      }}
      data-testid="highlights-summary"
    >
      <div className={backgroundStyle} />
      <div className={contentWrapperStyle}>
        <div className={contentStyle}>
          <div className={contentInnerStyle}>
            <div className={titleStyle}>Summary</div>
            <Summary />

            <div className={titleStyle}>Highlights</div>
            <HighlightList highlights={highlights} />
          </div>
        </div>
        <button className={toggleStyle} onClick={() => sidebar.toggle()} aria-label="Highlight summary">
          <SummaryIcon />
        </button>
      </div>
    </nav>
  );
}
