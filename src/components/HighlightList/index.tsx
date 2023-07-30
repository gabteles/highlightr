import { css } from '@emotion/css';
import { Highlight } from '../../types/Highlight';

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
  return (
    <div className={wrapperStyle}>
      <div className={titleStyle}>Summary</div>
      <div className={titleStyle}>Highlights</div>
      <ul>
        {highlights.map((highlight) => (
          <li key={highlight.uuid}>
            {highlight.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
