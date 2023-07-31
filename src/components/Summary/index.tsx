import { css } from '@emotion/css';
import { useContext, useState } from 'react';
import ConfigContext from '../../context/ConfigContext';
import classNames from 'classnames';
import usePageSummary from '../../hooks/usePageSummary';

const baseBoxStyle = css`
  background: #FFF;
  color: #000;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  position: relative;
`

const configMissingStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`

const inputWrapperStyle = css`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const inputStyle = css`
  flex: 1;
  border: 1px solid #000;
  border-right: none;
  border-radius: 4px 0 0 4px;
  padding: 8px;
  max-width: 400px;
  outline: none;
`;

const buttonStyle = css`
  border: 1px solid #000;
  border-left: none;
  border-radius: 0 4px 4px 0;
  padding: 8px;
  background: #000;
  color: #FFF;
  cursor: pointer;
  outline: none;
`;

const errorStyle = css`
  border-color: #F00;
`;

const loaderWrapperStyle = css`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.75);
`;

const loaderStyle = css`
  position: absolute;
  top: calc(50% - 24px);
  left: calc(50% - 24px);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #000;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg)
    }
  }
`;

export default function Summary() {
  const config = useContext(ConfigContext);
  const summary = usePageSummary({ fetch: config.valid });
  const [openAiKey, setOpenAiKey] = useState<string>('');

  if (!config.present || !config.valid) {
    return (
      <div className={classNames(baseBoxStyle, configMissingStyle)}>
        {
          config.loading && (
            <div className={loaderWrapperStyle}>
              <div className={loaderStyle} />
            </div>
          )
        }
        <span>Add your OpenAI key below to generate a summary</span>
        <div className={inputWrapperStyle}>
          <input
            type="password"
            className={classNames(inputStyle, { [errorStyle]: config.present && !config.valid && !config.loading})}
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
          />
          <button
            className={classNames(buttonStyle, { [errorStyle]: config.present && !config.valid && !config.loading})}
            onClick={() => config.setOpenAiKey(openAiKey)}
          >
            ✨
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={baseBoxStyle}>
      {
        summary.loading && (
          <div className={loaderWrapperStyle}>
            <div className={loaderStyle} />
          </div>
        )
      }
      {
        summary.summary
      }
    </div>
  );
}
