import { css } from '@emotion/css';
import { Highlight } from '../../types/Highlight';
import { useContext } from 'react';
import PageHighlightsContext from '../../context/PageHighlightsContext';
import DeleteIcon from './assets/delete.svg';
import useHighlightStore from '../../hooks/useHighlightStore';

type Props = {
  highlights: Highlight[]
};

const listStyle = css`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const itemStyle = css`
  background: #FFF;
  border-left: 6px solid #000;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #000;
`;

const itemInnerStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-style: italic;
  }
`;

const deleteStyle = css`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  display: flex;

  svg {
    width: 24px;
    height: 24px;
    color: #000;
    display: inline;
    transition: color 200ms ease-in-out;

    &:hover {
      color: #F00;
    }
  }
`;

export default function HighlightList({ highlights }: Props) {
  const { addEmphasis, removeEmphasis } = useContext(PageHighlightsContext);
  const store = useHighlightStore();

  const onClick = (uuid: string) => () => {
    document.querySelector(`[data-highlight-id="${uuid}"]`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };

  const onDelete = (uuid: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    store.removeHighlight(uuid);
  };

  return (
    <ul className={listStyle}>
      {highlights.map((highlight) => (
        <li
          key={highlight.uuid}
          onClick={onClick(highlight.uuid as string)}
          onMouseEnter={() => addEmphasis(highlight.uuid as string)}
          onMouseLeave={() => removeEmphasis(highlight.uuid as string)}
        >
          <div className={itemStyle}>
            <div className={itemInnerStyle}>
              <span>{highlight.text}</span>
              <button
                className={deleteStyle}
                onClick={onDelete(highlight.uuid as string)}
                data-testid={`remove-highlight-${highlight.uuid}`}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
