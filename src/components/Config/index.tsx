import { useContext, useEffect, useRef, useState } from 'react';
import ConfigContext from '../../context/ConfigContext';
import { css } from '@emotion/css';
import classNames from 'classnames';

type Props = {
  showEnable?: boolean;
  onSetup?: () => void;
}

const wrapperStyle = css`
  color: #000;
  padding: 16px;
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`

const inputWrapperStyle = css`
  min-width: 250px;
  display: flex;
  flex-direction: row;
`;

const inputStyle = css`
  flex: 1;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 8px;
  max-width: 400px;
  outline: none;
`;

const groupStyle = css`
  border-right: none;
  border-radius: 4px 0 0 4px;

  & + button {
    border-left: none;
    border-radius: 0 4px 4px 0;
  }
`;

const buttonStyle = css`
  border: 1px solid #000;
  border-radius: 4px;
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

const configWrapperStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

const verticalWrapperStyles = css`
  flex-direction: column;
`;

const switchStyle = css`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 34px;
    transition: 400ms;

    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 400ms;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #2196F3;
  }

  input:focus + span {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const submitStyle = css`
  width: 100%;
  text-align: right;
`;

export default function Config({ showEnable, onSetup }: Props) {
  const config = useContext(ConfigContext);
  const [openAiKey, setOpenAiKey] = useState<string>('');
  const savingConfig = useRef<boolean>(false);

  const onSaveConfig = () => {
    savingConfig.current = true;
    config.setOpenAiKey(openAiKey);
  }

  useEffect(() => {
    if (savingConfig.current && config.present && config.valid) {
      savingConfig.current = false;
      onSetup?.();
    }
  }, [config, onSetup]);

  return (
    <div className={wrapperStyle}>
      {
        config.loading && (
          <div className={loaderWrapperStyle} data-testid="loader">
            <div className={loaderStyle} />
          </div>
        )
      }

      {
        showEnable && (
          <div className={configWrapperStyle}>
            <strong>Enable Highlightr</strong>
            <div>
              <label className={switchStyle} aria-label="Enable" aria-checked={config.enabled}>
                <input type="checkbox" checked={config.enabled} onChange={(e) => config.setEnabled(e.target.checked)} />
                <span></span>
              </label>
            </div>
          </div>
        )
      }

      <div className={classNames(configWrapperStyle, { [verticalWrapperStyles]: !showEnable })}>
        {
          showEnable ? (
            <strong>OpenAI key</strong>
          ) : (
            <strong>Add your OpenAI key below to summarize</strong>
          )
        }
        <div className={inputWrapperStyle}>
          <input
            type="password"
            className={classNames(inputStyle, { [groupStyle]: !showEnable, [errorStyle]: config.present && !config.valid && !config.loading })}
            value={openAiKey}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            onChange={(e) => setOpenAiKey(e.target.value)}
            data-testid="openai-key-input"
          />
          {
            !showEnable && (
              <button
                data-testid="submit"
                className={classNames(buttonStyle, { [errorStyle]: config.present && !config.valid && !config.loading })}
                onClick={() => config.setOpenAiKey(openAiKey)}
              >
                ✨
              </button>
            )
          }
        </div>
      </div>

      {
        showEnable && (
          <div className={submitStyle}>
            <button
              data-testid="submit"
              className={classNames(buttonStyle, { [errorStyle]: config.present && !config.valid && !config.loading })}
              onClick={onSaveConfig}
            >
              ✨ Sumarize
            </button>
          </div>
        )
      }
    </div>
  );
}

Config.defaultProps = {
  showEnable: true,
  onSetup: () => {},
};
