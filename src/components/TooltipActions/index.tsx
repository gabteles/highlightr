import { css } from '@emotion/css';

import SummaryIcon from './assets/summary.svg';

const wrapperStyle = css`
  padding: 8px;
  background: #242424;
  border-radius: 4px;
  font-size: 18px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  user-select: none;
`;

const buttonStyle = css`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;

  svg {
    display: inline-block;
    width: 24px;
    height: 24px;
  }
`;

export default function TooltipActions() {
  const onSummary = () => alert('Summary');

  return (
    <div className={wrapperStyle}>
      <button className={buttonStyle} onClick={onSummary}>
        <SummaryIcon />
        <span>Summary</span>
      </button>
    </div>
  )
}
