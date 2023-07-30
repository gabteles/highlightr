import { css } from '@emotion/css';
import { Highlight } from '../../types/Highlight';
import { useContext } from 'react';
import PageHighlightsContext from '../../context/PageHighlightsContext';

type Props = {
  highlights: Highlight[]
};

const wrapperStyle = css`
  padding: 16px;
  height: 100%;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      background: #FFF;
      color: #000;
      padding: 4px;
      font-style: italic;
      border-radius: 4px;
      border-left: 6px solid #99cc33;
      margin-bottom: 8px;
      cursor: pointer;
    }
  }
`;

const titleStyle = css`
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: bold;
  color: #000;
`;

export default function HighlightList({ highlights }: Props) {
  const { addEmphasis, removeEmphasis } = useContext(PageHighlightsContext);

  const onClick = (uuid: string) => () => {
    document.querySelector(`[data-highlight-id="${uuid}"]`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };

  return (
    <div className={wrapperStyle}>
      <div className={titleStyle}>Summary</div>
      <div className={titleStyle}>Highlights</div>
      <ul>
        {highlights.map((highlight) => (
          <li
            key={highlight.uuid}
            onClick={onClick(highlight.uuid as string)}
            onMouseEnter={() => addEmphasis(highlight.uuid as string)}
            onMouseLeave={() => removeEmphasis(highlight.uuid as string)}
          >
            {highlight.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
