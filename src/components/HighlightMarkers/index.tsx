import { useCallback, useContext, useEffect } from 'react';
import PageHighlightsContext from '../../context/PageHighlightsContext';
import { Highlight } from '../../types/Highlight';
import { css } from '@emotion/css';
import elementFromQuery from '../../util/elementFromQuery';
import markHighlight from './markHighlight';
import clearHighlightMarks from './clearHighlightMarks';

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

  const updateStyles = () => {
    highlights.forEach((highlight) => {
      const styles = [highlightStyle];
      if (emphasis.includes(highlight.uuid as string)) styles.push(highlightEmphasisStyle);

      document.querySelectorAll(`[data-highlight-id="${highlight.uuid}"]`).forEach((highlightNode) => {
        highlightNode.className = styles.join(' ');
      });
    });
  }

  const onHoverListener = useCallback((ev: Event) => {
    const target = ev.target as HTMLElement;
    const highlightId = target.dataset.highlightId;
    if (highlightId) addEmphasis(highlightId);
  }, [addEmphasis]);

  const onHoverOutListener = useCallback((ev: Event) => {
    const target = ev.target as HTMLElement;
    const highlightId = target.dataset.highlightId;
    if (highlightId) removeEmphasis(highlightId);
  }, [removeEmphasis]);

  useEffect(() => {
    highlights
      .sort((a, b) => (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
      .forEach((highlight) => {
        const containerEl = elementFromQuery(highlight.container);
        if (!containerEl) return;

        try {
          markHighlight(containerEl, highlight);
        } catch {
          // DO NOTHING (?)
        }
      });

    document.querySelectorAll(`[data-highlight-id]`).forEach((el) => {
      el.addEventListener('mouseenter', onHoverListener);
      el.addEventListener('mouseleave', onHoverOutListener);
    });

    updateStyles();

    return () => {
      clearHighlightMarks();
      emphasis.forEach((highlightId) => removeEmphasis(highlightId));
      document.querySelectorAll(`[data-highlight-id]`).forEach((el) => {
        el.removeEventListener('mouseenter', onHoverListener);
        el.removeEventListener('mouseleave', onHoverOutListener);
      });
    };
  }, [highlights, onHoverListener, onHoverOutListener]);

  useEffect(() => {
    updateStyles();
  }, [highlights, emphasis]);

  return null;
}
