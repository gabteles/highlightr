import { css } from '@emotion/css';
import { useContext } from 'react';
import ConfigContext from '../../context/ConfigContext';
import usePageSummary from '../../hooks/usePageSummary';
import Config from '../Config';

const baseBoxStyle = css`
  background: #FFF;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
`;

export default function Summary() {
  const config = useContext(ConfigContext);
  const summary = usePageSummary({ fetch: config.valid });

  if (!config.present || !config.valid) {
    return (
      <div className={baseBoxStyle}>
        <Config showEnable={false} />
      </div>
    )
  }

  return (
    <div className={baseBoxStyle}>
      {/** TODO: Placeholder blocks */}
      {
        summary.summary
      }
    </div>
  );
}
