import { useContext, useEffect } from 'react';
import PageHighlightsContext from '../../context/PageHighlightsContext';
import { css } from '@emotion/css';
import markHighlight from './markHighlight';
import clearHighlightMarks from './clearHighlightMarks';
import SidebarContext from '../../context/SidebarContext';

const highlightStyle = css`
  background: rgba(255, 255, 0, 0.5);
  color: red;

  &:hover {
    cursor: pointer;
  }
`;

const highlightEmphasisStyle = css`
  background: rgba(255, 255, 0, 1);
  color: red;
`;

export default function HighlightMarkers() {
  const { highlights, emphasis, addEmphasis, removeEmphasis } = useContext(PageHighlightsContext);
  const sidebar = useContext(SidebarContext);

  // Creates markers
  useEffect(() => {
    highlights
      .sort((a, b) => (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
      .forEach((highlight) => {
        try {
          markHighlight({ highlight });
        } catch {
          // DO NOTHING (?)
        }
      });

    return () => {
      clearHighlightMarks();
      highlights.forEach((highlight) => removeEmphasis(highlight.uuid as string));
    };
  }, [highlights, removeEmphasis]);

  // Adds listeners to markers
  useEffect(() => {
    const onHoverListener = (ev: Event) => {
      const target = ev.target as HTMLElement;
      const highlightId = target.dataset.highlightId;
      if (highlightId) addEmphasis(highlightId);
    };

    const onHoverOutListener = (ev: Event) => {
      const target = ev.target as HTMLElement;
      const highlightId = target.dataset.highlightId;
      if (highlightId) removeEmphasis(highlightId);
    };

    const onClickListener = () => {
      sidebar.open();
    }

    document.querySelectorAll(`[data-highlight-id]`).forEach((el) => {
      el.addEventListener('mouseenter', onHoverListener);
      el.addEventListener('mouseleave', onHoverOutListener);
      el.addEventListener('click', onClickListener);
    });

    return () => {
      document.querySelectorAll(`[data-highlight-id]`).forEach((el) => {
        el.removeEventListener('mouseenter', onHoverListener);
        el.removeEventListener('mouseleave', onHoverOutListener);
        el.removeEventListener('click', onClickListener);
      });
    };
  }, [highlights, addEmphasis, removeEmphasis, sidebar]);

  // Updates marker styles based on emphasis
  useEffect(() => {
    highlights.forEach((highlight) => {
      const styles = [highlightStyle];
      if (emphasis.includes(highlight.uuid as string)) styles.push(highlightEmphasisStyle);

      document
        .querySelectorAll(`[data-highlight-id="${highlight.uuid}"]`)
        .forEach((highlightNode) => highlightNode.className = styles.join(' '));
    });
  }, [highlights, emphasis]);

  return null;
}
