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

const boxInnerStyle = css`
  padding: 16px;
`;

const paragraphPlaceholderStyle = css`
  background: #CCC;
  border-radius: 4px;
  height: 16px;
  margin-bottom: 8px;
  opacity: 0.5;
  animation: pulse 1s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const tagsWrapperStyle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
  gap: 8px;
`;

const tagPlaceholderStyle = css`
  background: #CCC;
  border-radius: 4px;
  height: 16px;
  opacity: 0.5;
  animation: pulse 1s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const tagStyle = css`
  background: #EEE;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  color: #666;
  font-weight: bold;
`;

export default function Summary() {
  const config = useContext(ConfigContext);
  const summary = usePageSummary({ fetch: config.valid });

  if (!config.present || !config.valid) {
    return (
      <div className={baseBoxStyle} data-testid="config">
        <Config showEnable={false} />
      </div>
    )
  }

  return (
    <div className={baseBoxStyle}>
      <div className={boxInnerStyle}>
        {
          summary.loading && (
            <div data-testid="loader">
              {
                new Array(4).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className={paragraphPlaceholderStyle}
                    style={{ width: `${20 + Math.round(Math.random() * 80)}%` }}
                  />
                ))
              }

              <div className={tagsWrapperStyle}>
                <div className={tagPlaceholderStyle} style={{ width: `${20 + Math.round(Math.random() * 40)}px` }} />
                <div className={tagPlaceholderStyle} style={{ width: `${20 + Math.round(Math.random() * 40)}px` }} />
                <div className={tagPlaceholderStyle} style={{ width: `${20 + Math.round(Math.random() * 40)}px` }} />
                <div className={tagPlaceholderStyle} style={{ width: `${20 + Math.round(Math.random() * 40)}px` }} />
              </div>
            </div>
          )
        }

        {
          !summary.loading && (
            <>
              {summary.summary}

              <div className={tagsWrapperStyle}>
                {
                  summary.tags.map((tag, i) => (
                    <div key={i} className={tagStyle}>#{tag}</div>
                  ))
                }
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}
